import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import WebSocketService from "../utils/websocket";
import { useToast } from "@/hooks/use-toast";

// Define types for our context
export type User = {
  id: string;
  username: string;
};

export type Room = {
  id: string;
  name: string;
  users: number;
};

export type ChatMessage = {
  id: number | string;
  text: string;
  sender: string;
  room: string;
  timestamp: string;
  isFormattedText?: boolean;
};

type ChatContextType = {
  currentUser: User | null;
  messages: ChatMessage[];
  rooms: Room[];
  currentRoom: Room | null;
  setUsername: (username: string) => void;
  joinRoom: (roomId: string) => void;
  createRoom: (roomName: string) => void;
  sendMessage: (text: string, isFormattedText?: boolean) => void;
  isConnected: boolean;
  logout: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock WebSocket URL - Replace with your actual WebSocket server URL in production
const WS_URL = "wss://echo.websocket.org"; // Example for testing

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [websocket, setWebsocket] = useState<WebSocketService | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Store messages per room
  const [roomMessages, setRoomMessages] = useState<Record<string, ChatMessage[]>>({});
  const [rooms, setRooms] = useState<Room[]>([
    { id: "general", name: "General", users: 5 },
    { id: "support", name: "Support", users: 2 },
    { id: "random", name: "Random", users: 8 }
  ]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // The messages for the current room (derived from roomMessages)
  const messages = currentRoom?.id && roomMessages[currentRoom.id] ? roomMessages[currentRoom.id] : [];

  // Initialize WebSocket connection when a user is set
  useEffect(() => {
    if (currentUser) {
      const ws = new WebSocketService(WS_URL, {
        onOpen: () => {
          setIsConnected(true);
          toast({
            title: "Connected",
            description: "You are connected to the chat server",
          });
        },
        onMessage: (data) => {
          handleIncomingMessage(data);
        },
        onClose: () => {
          setIsConnected(false);
          toast({
            title: "Disconnected",
            description: "Connection to chat server lost",
            variant: "destructive",
          });
        },
        onError: () => {
          toast({
            title: "Connection Error",
            description: "Failed to connect to chat server",
            variant: "destructive",
          });
        }
      });

      ws.connect();
      setWebsocket(ws);

      return () => {
        ws.disconnect();
      };
    }
  }, [currentUser]);

  // Function to handle incoming WebSocket messages
  const handleIncomingMessage = (data: any) => {
    // Simulate receiving messages per room
    if (data.type === "chat_message" && data.room) {
      setRoomMessages((prev) => {
        const prevMsgs = prev[data.room] || [];
        return {
          ...prev,
          [data.room]: [
            ...prevMsgs,
            {
              id: Date.now(),
              text: data.text,
              sender: data.sender,
              room: data.room,
              timestamp: data.timestamp,
              isFormattedText: data.isFormattedText
            }
          ]
        };
      });
    } else if (data.type === "room_update") {
      setRooms(data.rooms);
    }
  };

  // Set username and create user
  const setUsername = (username: string) => {
    if (username.trim()) {
      const userId = `user_${Date.now()}`;
      setCurrentUser({ id: userId, username });
      // Add welcome message to "general" history
      setRoomMessages((prev) => ({
        ...prev,
        general: [{
          id: Date.now(),
          text: `Welcome to the chat, ${username}!`,
          sender: "system",
          room: "general",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]
      }));
      // Auto-join general room
      joinRoom("general");
    }
  };

  // Join a chat room
  const joinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room && currentUser) {
      setCurrentRoom(room);
      // If the room has no history yet, initialize with a system message
      setRoomMessages((prev) => {
        if (prev[roomId]) return prev;
        return {
          ...prev,
          [roomId]: [{
            id: Date.now(),
            text: `You joined the ${room.name} room`,
            sender: "system",
            room: roomId,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }]
        };
      });

      if (websocket) {
        websocket.sendMessage({
          type: "join_room",
          room: roomId,
          userId: currentUser.id,
          username: currentUser.username
        });
        // Add system message for joining room (if not already set above)
        setTimeout(() => {
          setRoomMessages((prev) => {
            const msgs = prev[roomId] || [];
            // If last system message not for joining, add it
            if (!msgs.length || msgs[msgs.length - 1].sender !== "system" || !msgs[msgs.length - 1].text.includes("joined the")) {
              return {
                ...prev,
                [roomId]: [
                  ...msgs,
                  {
                    id: Date.now(),
                    text: `You joined the ${room.name} room`,
                    sender: "system",
                    room: roomId,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ]
              };
            }
            return prev;
          });
        }, 500);
      }
    }
  };

  // Create a new chat room
  const createRoom = (roomName: string) => {
    if (roomName.trim() && currentUser) {
      const newRoomId = `room_${Date.now()}`;
      const newRoom = {
        id: newRoomId,
        name: roomName,
        users: 1
      };
      setRooms(prev => [...prev, newRoom]);
      // Add initial empty message list
      setRoomMessages(prev => ({ ...prev, [newRoomId]: [] }));
      joinRoom(newRoomId);
      toast({
        title: "Room Created",
        description: `You created the room ${roomName}`
      });
    }
  };

  // Send a message to the current room
  const sendMessage = (text: string, isFormattedText: boolean = false) => {
    if (text.trim() && currentUser && currentRoom && websocket) {
      const newMessage = {
        type: "chat_message",
        id: Date.now(),
        text,
        sender: currentUser.username,
        room: currentRoom.id,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFormattedText
      };
      websocket.sendMessage(newMessage);

      // Add to the relevant room's message history
      setRoomMessages((prev) => {
        const prevMsgs = prev[currentRoom.id] || [];
        return {
          ...prev,
          [currentRoom.id]: [...prevMsgs, newMessage]
        };
      });
    }
  };

  // Logout function
  const logout = () => {
    if (websocket) {
      websocket.disconnect();
    }
    setCurrentUser(null);
    setCurrentRoom(null);
    setRoomMessages({});
    setIsConnected(false);
  };

  return (
    <ChatContext.Provider value={{
      currentUser,
      messages,
      rooms,
      currentRoom,
      setUsername,
      joinRoom,
      createRoom,
      sendMessage,
      isConnected,
      logout
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
