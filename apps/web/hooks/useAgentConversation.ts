"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceStream } from "voice-stream";
import type { ElevenLabsWebSocketEvent } from "@/app/types/websocket";

const sendMessage = async (websocket: WebSocket, request: object) => {
  if (websocket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket not open, message not sent:", request);
    return;
  }
  const requestString = JSON.stringify(request);
  websocket.send(requestString);
};

interface UseAgentConversationProps {
  signedUrl: string;
  onAgentResponse?: (response: string) => void;
  onAudioResponse?: (audioData: string) => void;
  onUserTranscript?: (transcript: string) => void;
}

export const useAgentConversation = ({
  signedUrl,
  onAgentResponse,
  onAudioResponse,
  onUserTranscript,
}: UseAgentConversationProps) => {
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isManualDisconnectRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const nextAudioTimeRef = useRef(0);

  const base64ToArrayBuffer = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const wrapPcmAsWav = (pcmBuffer: ArrayBuffer, sampleRate = 16000) => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    const pcmLength = pcmBuffer.byteLength;
    writeString(0, "RIFF");
    view.setUint32(4, 36 + pcmLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, pcmLength, true);

    const wav = new Uint8Array(44 + pcmLength);
    wav.set(new Uint8Array(header), 0);
    wav.set(new Uint8Array(pcmBuffer), 44);

    return wav.buffer;
  };

  const processAudioQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return;
    isPlayingRef.current = true;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        nextAudioTimeRef.current = audioContextRef.current.currentTime;
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      while (audioQueueRef.current.length > 0) {
        const base64Audio = audioQueueRef.current.shift();
        if (!base64Audio) continue;

        try {
          const pcm = base64ToArrayBuffer(base64Audio);
          const wav = wrapPcmAsWav(pcm);
          const audioBuffer =
            await audioContextRef.current.decodeAudioData(wav);

          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);

          const startTime = Math.max(
            nextAudioTimeRef.current,
            audioContextRef.current.currentTime
          );
          source.start(startTime);
          nextAudioTimeRef.current = startTime + audioBuffer.duration;

          await new Promise((resolve) => {
            source.onended = resolve;
          });
        } catch (err) {
          console.error("Failed to decode/play audio chunk:", err);
        }
      }
    } finally {
      isPlayingRef.current = false;
    }
  }, []);

  const enqueueAudioChunk = useCallback(
    async (base64Audio: string) => {
      audioQueueRef.current.push(base64Audio);
      processAudioQueue();
    },
    [processAudioQueue]
  );

  const cleanupWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.onopen = null;
      websocketRef.current.onmessage = null;
      websocketRef.current.onclose = null;
      websocketRef.current.onerror = null;
      if (websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.close();
      }
      websocketRef.current = null;
    }
  }, []);

  const { startStreaming, stopStreaming } = useVoiceStream({
    onAudioChunked: (audioData) => {
      if (websocketRef.current?.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket not ready for audio data");
        return;
      }
      sendMessage(websocketRef.current, {
        user_audio_chunk: audioData,
      });
    },
  });

  const startConversation = useCallback(async () => {
    if (!signedUrl || signedUrl.trim() === "") {
      console.warn("No signed URL provided");
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    cleanupWebSocket();

    const websocket = new WebSocket(signedUrl);
    websocketRef.current = websocket;

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      isManualDisconnectRef.current = false;

      sendMessage(websocket, {
        type: "conversation_initiation_client_data",
      });
    };

    websocket.onmessage = async (event) => {
      try {
        // Handle simple ping/pong first
        if (event.data === "ping") {
          console.log("Received ping, sending pong");
          websocket.send("pong");
          return;
        }

        // Handle JSON messages
        const data = JSON.parse(event.data) as ElevenLabsWebSocketEvent;
        console.log("WebSocket message received:", data.type);

        switch (data.type) {
          case "ping":
            // Handle structured ping message
            if (data.ping_event?.event_id) {
              const delay = data.ping_event.ping_ms || 0;
              setTimeout(() => {
                sendMessage(websocket, {
                  type: "pong",
                  event_id: data.ping_event.event_id,
                });
              }, delay);
            } else {
              // Simple pong response
              websocket.send("pong");
            }
            break;

          case "user_transcript":
            if (data.user_transcription_event?.user_transcript) {
              onUserTranscript?.(data.user_transcription_event.user_transcript);
            }
            break;

          case "agent_response":
            if (data.agent_response_event?.agent_response) {
              onAgentResponse?.(data.agent_response_event.agent_response);
            }
            break;

          case "interruption":
            console.warn("Interruption:", data.interruption_event?.reason);
            audioQueueRef.current = [];
            isPlayingRef.current = false;
            break;

          case "audio":
            if (data.audio_event?.audio_base_64) {
              await enqueueAudioChunk(data.audio_event.audio_base_64);
              onAudioResponse?.(data.audio_event.audio_base_64);
            }
            break;

          case "conversation_initiation_metadata":
            console.log(
              "Metadata received:",
              data.conversation_initiation_metadata_event
            );
            break;

          default:
            console.warn("Unhandled message type:", data.type);
        }
      } catch (err) {
        console.error(
          "Failed to handle WebSocket message",
          err,
          "Raw data:",
          event.data
        );
      }
    };

    websocket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsConnected(false);
      setIsStreaming(false);

      if (isStreaming) stopStreaming().catch(console.error);
      if (!isManualDisconnectRef.current && event.code !== 1000) {
        attemptReconnect();
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
  }, [
    signedUrl,
    cleanupWebSocket,
    enqueueAudioChunk,
    onAgentResponse,
    onAudioResponse,
    onUserTranscript,
    stopStreaming,
    isStreaming,
  ]);

  const attemptReconnect = useCallback(() => {
    if (isManualDisconnectRef.current || !signedUrl) return;

    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current++, 30000);
      console.log(`Reconnecting in ${delay}ms`);

      reconnectTimeoutRef.current = setTimeout(() => {
        startConversation();
      }, delay);
    } else {
      console.error("Max reconnect attempts reached");
    }
  }, [signedUrl, startConversation]);

  const stopConversation = useCallback(async () => {
    console.log("Stopping conversation manually");
    isManualDisconnectRef.current = true;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (isStreaming) {
      try {
        await stopStreaming();
        setIsStreaming(false);
      } catch (err) {
        console.error("Error stopping stream:", err);
      }
    }

    cleanupWebSocket();
    setIsConnected(false);
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  }, [isStreaming, stopStreaming, cleanupWebSocket]);

  const startVoiceStreaming = useCallback(async () => {
    if (!isConnected) {
      console.error("Cannot stream: not connected");
      return;
    }
    if (!isStreaming) {
      try {
        await startStreaming();
        setIsStreaming(true);
      } catch (err) {
        console.error("Error starting stream:", err);
      }
    }
  }, [isConnected, isStreaming, startStreaming]);

  const stopVoiceStreaming = useCallback(async () => {
    if (isStreaming) {
      try {
        await stopStreaming();
        setIsStreaming(false);
      } catch (err) {
        console.error("Error stopping stream:", err);
      }
    }
  }, [isStreaming, stopStreaming]);

  const sendTextMessage = useCallback((text: string) => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error("WebSocket not connected");
      return;
    }
    sendMessage(websocketRef.current, {
      type: "user_message",
      text,
    });
  }, []);

  useEffect(() => {
    return () => {
      isManualDisconnectRef.current = true;
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
      cleanupWebSocket();
      audioContextRef.current?.close();
    };
  }, [cleanupWebSocket]);

  return {
    startConversation,
    stopConversation,
    startVoiceStreaming,
    stopVoiceStreaming,
    sendTextMessage,
    isConnected,
    isStreaming,
  };
};
