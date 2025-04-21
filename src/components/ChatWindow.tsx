
import React, { useRef, useState, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "./ChatMessage";
import { ChatMessage } from "./ChatMessage";
import { Send } from "lucide-react";

const DEMO_MESSAGES: ChatMessageType[] = [
  {
    id: 1,
    text: "Hello! How can I assist you today?",
    sender: "assistant",
    timestamp: "09:15 AM",
  },
  {
    id: 2,
    text: "Hi, I have a question about a prescription.",
    sender: "user",
    timestamp: "09:16 AM",
  },
  {
    id: 3,
    text: "Of course! Please share the details or send an image of your prescription.",
    sender: "assistant",
    timestamp: "09:17 AM",
  },
];

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageType[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo(0, threadRef.current.scrollHeight);
  }, [messages]);

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const newMsg: ChatMessageType = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setInput("");
    // Simulate assistant reply (for demo purposes)
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        {
          id: Date.now() + 1,
          text: "Thank you for your message. An assistant will reply shortly.",
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  }

  return (
    <>
      <div ref={threadRef} className="chat-window">
        {messages.map(msg => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
      </div>
      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          className="chat-input"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          aria-label="Type your message"
          autoFocus
        />
        <button
          className="send-btn"
          type="submit"
          aria-label="Send"
          disabled={!input.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </>
  );
}
