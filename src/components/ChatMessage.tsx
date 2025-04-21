
import React from "react";
import { User } from "lucide-react";
import DOMPurify from 'dompurify';

export type ChatMessage = {
  id: number | string;
  text: string;
  sender: string;
  timestamp: string;
  isFormattedText?: boolean;
  isSystem?: boolean;
};

// Simple function to format text with basic markdown-like syntax
const formatText = (text: string): string => {
  // Replace **text** with <strong>text</strong> for bold
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace _text_ with <em>text</em> for italics
  formattedText = formattedText.replace(/\_(.*?)\_/g, '<em>$1</em>');
  
  // Replace URLs with links
  formattedText = formattedText.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-aqua underline">$1</a>'
  );
  
  return formattedText;
};

export function ChatMessage({ text, sender, timestamp, isFormattedText, isSystem }: ChatMessage) {
  const isUser = sender === "user";
  const isAssistant = sender === "assistant";
  
  // For system messages, show them centered with different styling
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-600 text-xs py-1 px-3 rounded-full">
          {text}
        </div>
      </div>
    );
  }

  // Format the message text if needed
  const messageContent = isFormattedText ? (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatText(text)) }} />
  ) : (
    text
  );

  return (
    <div className="flex items-end mb-2">
      {!isUser && (
        <span className="flex-shrink-0 mr-2 rounded-full bg-aqua-light w-9 h-9 flex items-center justify-center shadow-soft">
          <User size={20} className="text-aqua" />
        </span>
      )}
      <div className={`bubble ${isUser ? 'user' : 'assistant'}`}>
        {!isUser && !isAssistant && (
          <div className="font-medium text-xs mb-1 text-aqua">{sender}</div>
        )}
        {messageContent}
        <span className="message-meta block">
          {timestamp}
        </span>
      </div>
      {isUser && (
        <span className="flex-shrink-0 ml-2 rounded-full bg-gradient-to-br from-aqua to-medgreen w-9 h-9 flex items-center justify-center shadow-soft">
          <User size={20} className="text-white" />
        </span>
      )}
    </div>
  );
}
