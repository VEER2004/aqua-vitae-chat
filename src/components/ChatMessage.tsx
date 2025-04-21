
import React from "react";
import { User, User as UserIcon } from "lucide-react";

export type ChatMessage = {
  id: number | string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
};

export function ChatMessage({ text, sender, timestamp }: ChatMessage) {
  return (
    <div className="flex items-end mb-2">
      {sender === "assistant" && (
        <span className="flex-shrink-0 mr-2 rounded-full bg-aqua-light w-9 h-9 flex items-center justify-center shadow-soft">
          <UserIcon size={20} className="text-aqua" />
        </span>
      )}
      <div className={`bubble ${sender}`}>{text}
        <span className="message-meta block">
          {timestamp}
        </span>
      </div>
      {sender === "user" && (
        <span className="flex-shrink-0 ml-2 rounded-full bg-gradient-to-br from-aqua to-medgreen w-9 h-9 flex items-center justify-center shadow-soft">
          <UserIcon size={20} className="text-white" />
        </span>
      )}
    </div>
  );
}
