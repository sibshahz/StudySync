"use client";

import { useCallback, useState } from "react";
import { useAgentConversation } from "../hooks/useAgentConversation";

interface ConversationProps {
  signedUrl?: string;
}

export function Conversation({ signedUrl }: ConversationProps) {
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Always call this hook
  const {
    startConversation,
    stopConversation,
    isConnected,
    sendTextMessage, // 👈 Make sure this is exposed from the hook
  } = useAgentConversation(signedUrl || "");

  const handleStart = useCallback(async () => {
    await startConversation(); // You can remove mic permission check if it's not needed
  }, [startConversation]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    sendTextMessage(message.trim());
    setMessage("");
  }, [message, sendTextMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!signedUrl) {
    return (
      <div className="text-red-500 text-center">
        Missing signed WebSocket URL.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={handleStart}
          disabled={isConnected}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
        {micPermissionDenied && (
          <p className="text-red-500 text-sm mt-2">
            Microphone access is required to start the conversation.
          </p>
        )}
      </div>

      <div className="w-full max-w-md flex gap-2 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !message.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
