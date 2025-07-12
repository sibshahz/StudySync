"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  getAgentLink,
  getSingleAgent,
  postGetTextToSpeech,
} from "@/lib/api/agents";
import { useAgentConversation } from "../hooks/useAgentConversation";

interface Message {
  id: string;
  type: "user" | "agent" | "user_transcript";
  content: string;
  timestamp: Date;
  hasAudio?: boolean;
}

interface AudioState {
  messageId: string | null;
  status: "idle" | "loading" | "playing" | "paused";
}

export default function AgentChat({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agent, setAgent] = useState<any>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [audioState, setAudioState] = useState<AudioState>({
    messageId: null,
    status: "idle",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connectionInitialized = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Memoize callback functions to prevent unnecessary re-renders
  const handleAgentResponse = useCallback((response: string) => {
    console.log("Agent response received:", response);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "agent",
        content: response,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  }, []);

  const handleAudioResponse = useCallback(
    (audioData: string) => {
      if (!audioEnabled) return;
      setMessages((prev) => {
        const lastAgentIndex = prev.findLastIndex(
          (msg) => msg.type === "agent"
        );
        if (lastAgentIndex !== -1) {
          const updated = [...prev];
          updated[lastAgentIndex] = {
            ...updated[lastAgentIndex],
            hasAudio: true,
          };
          return updated;
        }
        return prev;
      });
    },
    [audioEnabled]
  );

  const handleUserTranscript = useCallback((transcript: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "user_transcript",
        content: transcript,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(true);
  }, []);

  // Audio playback functions
  const fetchAndPlayAudio = useCallback(
    async (messageId: string, messageContent: string) => {
      try {
        setAudioState({ messageId, status: "loading" });

        // Call your API to get audio - set responseType to 'blob' for binary data
        const response = await postGetTextToSpeech(messageContent);
        console.log("Audio response:", response);

        if (!response.data) {
          throw new Error("No audio data received");
        }

        // The response should now be a blob directly
        const audioBlob =
          response.data instanceof Blob ?
            response.data
          : new Blob([response.data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create new audio element
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.addEventListener("loadeddata", () => {
          setAudioState({ messageId, status: "playing" });
          audio.play();
        });

        audio.addEventListener("ended", () => {
          setAudioState({ messageId: null, status: "idle" });
          URL.revokeObjectURL(audioUrl);
        });

        audio.addEventListener("error", (e) => {
          console.error("Audio playback error:", e);
          setAudioState({ messageId: null, status: "idle" });
          URL.revokeObjectURL(audioUrl);
          toast.error("Audio playback failed");
        });

        audio.addEventListener("pause", () => {
          setAudioState((prev) => ({ ...prev, status: "paused" }));
        });

        audio.addEventListener("play", () => {
          setAudioState((prev) => ({ ...prev, status: "playing" }));
        });
      } catch (error) {
        console.error("Error fetching audio:", error);
        setAudioState({ messageId: null, status: "idle" });
        toast.error("Failed to load audio");
      }
    },
    [agentId]
  );

  const handlePlayAudio = useCallback(
    async (messageId: string, messageContent: string) => {
      if (audioState.messageId === messageId) {
        // Same message - toggle play/pause
        if (audioState.status === "playing") {
          audioRef.current?.pause();
        } else if (audioState.status === "paused") {
          audioRef.current?.play();
        }
      } else {
        // Different message - stop current and play new
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        await fetchAndPlayAudio(messageId, messageContent);
      }
    },
    [audioState, fetchAndPlayAudio]
  );

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setAudioState({ messageId: null, status: "idle" });
  }, []);

  const {
    startConversation,
    stopConversation,
    startVoiceStreaming,
    stopVoiceStreaming,
    sendTextMessage,
    isConnected,
    isStreaming,
  } = useAgentConversation({
    signedUrl: signedUrl || "",
    onAgentResponse: handleAgentResponse,
    onAudioResponse: audioEnabled ? handleAudioResponse : undefined,
    onUserTranscript: handleUserTranscript,
  });

  // Fetch agent data and signed URL
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        console.log("Fetching agent data for ID:", agentId);

        const agentData = await getSingleAgent(agentId);
        console.log("Agent data received:", agentData.data);
        setAgent(agentData.data);

        const url = await getAgentLink(agentData.data.agent_id);
        console.log("Agent link response:", url);

        if (url?.data?.url?.signedUrl) {
          console.log("Signed URL received:", url.data.url.signedUrl);
          setSignedUrl(url.data.url.signedUrl);
        } else {
          console.error("No signed URL in response:", url);
          toast.error("Failed to get connection URL");
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast.error("Failed to load agent");
      } finally {
        setLoading(false);
      }
    };

    if (agentId && agentId.trim() !== "") {
      fetchAgent();
    } else {
      console.error("No agent ID provided");
      setLoading(false);
    }
  }, [agentId]);

  // Handle connection initialization
  useEffect(() => {
    if (
      signedUrl &&
      signedUrl.trim() !== "" &&
      !connectionInitialized.current &&
      !loading &&
      !isConnected
    ) {
      connectionInitialized.current = true;
      console.log("Initializing connection with signed URL");
      startConversation();
    }
  }, [signedUrl, startConversation, loading, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConversation();
      stopAudio();
    };
  }, [stopConversation, stopAudio]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !isConnected) return;

    const messageContent = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "user",
        content: messageContent,
        timestamp: new Date(),
      },
    ]);

    sendTextMessage(messageContent);
    setInputValue("");
    setIsTyping(true);
  }, [inputValue, isConnected, sendTextMessage]);

  const toggleVoiceStreaming = useCallback(async () => {
    if (!isConnected) {
      toast.error("Not connected to agent");
      return;
    }

    try {
      if (isStreaming) {
        await stopVoiceStreaming();
        toast.success("Voice stopped");
      } else {
        await startVoiceStreaming();
        toast.success("Voice started");
      }
    } catch (err) {
      console.error("Voice streaming error:", err);
      toast.error("Voice streaming failed");
    }
  }, [isConnected, isStreaming, stopVoiceStreaming, startVoiceStreaming]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const newState = !prev;
      toast.info(newState ? "Audio enabled" : "Audio disabled");
      return newState;
    });
  }, []);

  const getConnectionStatus = () => {
    if (loading) return { text: "Loading...", color: "bg-yellow-500" };
    if (isStreaming) return { text: "Listening", color: "bg-green-500" };
    if (isConnected) return { text: "Connected", color: "bg-blue-500" };
    return { text: "Disconnected", color: "bg-red-500" };
  };

  const getAudioButtonIcon = (messageId: string) => {
    if (audioState.messageId === messageId) {
      switch (audioState.status) {
        case "loading":
          return <Loader2 className="w-3 h-3 animate-spin" />;
        case "playing":
          return <Pause className="w-3 h-3" />;
        case "paused":
          return <Play className="w-3 h-3" />;
        default:
          return <Play className="w-3 h-3" />;
      }
    }
    return <Play className="w-3 h-3" />;
  };

  const connectionStatus = getConnectionStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading agent...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="h-full flex flex-col shadow-md">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{agent?.name || "AI Agent"}</CardTitle>
                <div className="text-sm flex gap-2 items-center">
                  <span
                    className={`w-2 h-2 rounded-full ${connectionStatus.color}`}
                  />
                  {connectionStatus.text}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={toggleAudio}>
                {audioEnabled ?
                  <Volume2 />
                : <VolumeX />}
              </Button>
              <Button
                onClick={toggleVoiceStreaming}
                disabled={!isConnected}
                variant={isStreaming ? "destructive" : "default"}
              >
                {isStreaming ?
                  <MicOff />
                : <Mic />}
                {isStreaming ? "Stop" : "Start"} Voice
              </Button>
              {audioState.status !== "idle" && (
                <Button onClick={stopAudio} variant="outline" size="sm">
                  <Square className="w-4 h-4" />
                  Stop Audio
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[80%] ${
                        msg.type === "user" ? "bg-blue-600 text-white"
                        : msg.type === "user_transcript" ?
                          "bg-green-100 text-green-800"
                        : "bg-gray-100 text-black"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {msg.type === "user_transcript" && (
                            <Badge variant="secondary" className="mb-1">
                              Voice Input
                            </Badge>
                          )}
                          {msg.hasAudio && (
                            <Badge variant="outline" className="mb-1">
                              Audio Response
                            </Badge>
                          )}
                          <div className="whitespace-pre-wrap">
                            {msg.content}
                          </div>
                        </div>

                        {/* Voice play button - show for all message types */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-auto min-w-0 ${
                            msg.type === "user" ?
                              "hover:bg-white/20 text-white/70 hover:text-white"
                            : msg.type === "user_transcript" ?
                              "hover:bg-green-200 text-green-600"
                            : "hover:bg-gray-200 text-gray-600"
                          }`}
                          onClick={() => handlePlayAudio(msg.id, msg.content)}
                          disabled={
                            audioState.status === "loading" &&
                            audioState.messageId !== msg.id
                          }
                        >
                          {getAudioButtonIcon(msg.id)}
                        </Button>
                      </div>

                      <div className="text-xs text-right mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl bg-gray-100 text-black">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Agent is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={!isConnected || isTyping}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isConnected || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
