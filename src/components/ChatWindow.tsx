
import React, { useRef, useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Send, PaperclipIcon } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { RoomList } from "./RoomList";

export function ChatWindow() {
  const { messages, sendMessage, currentRoom, currentUser, logout } = useChatContext();
  const [input, setInput] = useState("");
  const [isFormatted, setIsFormatted] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo(0, threadRef.current.scrollHeight);
  }, [messages]);

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input, isFormatted);
    setInput("");
    setIsFormatted(false);
  }

  function handleFormatToggle() {
    setIsFormatted(!isFormatted);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Sidebar with rooms list */}
      <div className="hidden md:block w-full md:w-64 lg:w-72">
        <RoomList />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1">
        <div className="chat-header bg-white p-3 rounded-t-xl border-b flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium text-gray-800">
              {currentRoom ? currentRoom.name : "Select a Room"}
            </span>
          </div>
          
          {currentUser && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">
                {currentUser.username}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-gray-700">
                Logout
              </Button>
            </div>
          )}
        </div>
        
        <div ref={threadRef} className="chat-window">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              text={msg.text}
              sender={msg.sender === currentUser?.username ? "user" : msg.sender}
              timestamp={msg.timestamp}
              isSystem={msg.sender === "system"}
              isFormattedText={msg.isFormattedText}
            />
          ))}
          
          {messages.length === 0 && currentRoom && (
            <div className="flex flex-col items-center justify-center h-full opacity-70">
              <div className="text-gray-400 text-center">
                <p className="mb-2">No messages yet in {currentRoom.name}</p>
                <p className="text-sm">Be the first to send a message!</p>
              </div>
            </div>
          )}
          
          {!currentRoom && (
            <div className="flex flex-col items-center justify-center h-full opacity-70">
              <div className="text-gray-400 text-center">
                <p className="mb-2">Please select a chat room</p>
                <p className="text-sm">or create a new one</p>
              </div>
            </div>
          )}
        </div>
        
        <form className="chat-input-area" onSubmit={handleSend}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFormatToggle}
            className={`${isFormatted ? 'bg-aqua-light text-aqua' : ''}`}
            title="Toggle formatting (**bold**, _italic_, URLs)"
          >
            <span className="font-mono text-xs">**_</span>
          </Button>
          
          <input
            className="chat-input"
            type="text"
            placeholder={isFormatted ? "Format with **bold**, _italic_, URLs" : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!currentRoom}
            aria-label="Type your message"
          />
          
          <button
            className="send-btn"
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || !currentRoom}
          >
            <Send size={22} />
          </button>
        </form>
        
        {isFormatted && (
          <div className="text-xs text-gray-500 mt-1 pl-4">
            <p>Formatting: **bold**, _italic_, URLs will be auto-linked</p>
          </div>
        )}
      </div>
    </div>
  );
}
