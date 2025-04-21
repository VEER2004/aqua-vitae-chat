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

// Create a static store for all messages that persists across sessions
// This simulates a server database but keeps it in memory
const globalMessageStore: Record<string, ChatMessage[]> = {
  general: [
    {
      id: 'welcome',
      text: 'Welcome to the chat! Messages are now persistent across sessions.',
      sender: 'system',
      room: 'general',
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ],
  support: [],
  random: []
};

// Mock WebSocket URL - Replace with your actual WebSocket server URL in production
const WS_URL = "wss://echo.websocket.org"; // Example for testing

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [websocket, setWebsocket] = useState<WebSocketService | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Store messages per room, but initialize with our global store
  const [roomMessages, setRoomMessages] = useState<Record<string, ChatMessage[]>>(globalMessageStore);
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
      // Update our local state
      setRoomMessages((prev) => {
        const prevMsgs = prev[data.room] || [];
        const newMessages = [
          ...prevMsgs,
          {
            id: Date.now(),
            text: data.text,
            sender: data.sender,
            room: data.room,
            timestamp: data.timestamp,
            isFormattedText: data.isFormattedText
          }
        ];
        
        // Also update our global store so it persists
        globalMessageStore[data.room] = newMessages;
        
        return {
          ...prev,
          [data.room]: newMessages
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
      
      // Don't add welcome message again if it already exists in the global store
      if (!globalMessageStore.general.some(msg => 
          msg.text.includes(`Welcome to the chat, ${username}!`))) {
        // Add welcome message to "general" history
        const welcomeMsg = {
          id: Date.now(),
          text: `Welcome to the chat, ${username}!`,
          sender: "system",
          room: "general",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        
        globalMessageStore.general.push(welcomeMsg);
        setRoomMessages(prev => ({
          ...prev,
          general: [...globalMessageStore.general]
        }));
      } else {
        // Make sure our local state is synced with global store
        setRoomMessages(prev => ({
          ...prev,
          general: [...globalMessageStore.general]
        }));
      }
      
      // Auto-join general room
      joinRoom("general");
    }
  };

  // Join a chat room
  const joinRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room && currentUser) {
      setCurrentRoom(room);
      
      // Ensure we have this room in our global store
      if (!globalMessageStore[roomId]) {
        globalMessageStore[roomId] = [{
          id: Date.now(),
          text: `You joined the ${room.name} room`,
          sender: "system",
          room: roomId,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }];
      }
      
      // Make sure our local state is synced with global store
      setRoomMessages(prev => ({
        ...prev,
        [roomId]: [...globalMessageStore[roomId]]
      }));

      if (websocket) {
        websocket.sendMessage({
          type: "join_room",
          room: roomId,
          userId: currentUser.id,
          username: currentUser.username
        });
        
        // Add a join message if needed
        const hasRecentJoinMessage = globalMessageStore[roomId].some(msg => 
          msg.sender === "system" && 
          msg.text.includes("joined") && 
          Date.now() - Number(msg.id) < 5000
        );
        
        if (!hasRecentJoinMessage) {
          const joinMsg = {
            id: Date.now(),
            text: `${currentUser.username} joined the ${room.name} room`,
            sender: "system",
            room: roomId,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          
          globalMessageStore[roomId].push(joinMsg);
          
          setRoomMessages(prev => ({
            ...prev,
            [roomId]: [...globalMessageStore[roomId]]
          }));
        }
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
      
      // Initialize the room in our global store
      globalMessageStore[newRoomId] = [];
      
      // Update our local state
      setRoomMessages(prev => ({ 
        ...prev, 
        [newRoomId]: [] 
      }));
      
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
      const updatedMessages = [
        ...(globalMessageStore[currentRoom.id] || []),
        newMessage
      ];
      
      // Update our global store
      globalMessageStore[currentRoom.id] = updatedMessages;
      
      // Update our local state
      setRoomMessages((prev) => ({
        ...prev,
        [currentRoom.id]: updatedMessages
      }));
    }
  };

  // Logout function
  const logout = () => {
    if (websocket) {
      websocket.disconnect();
    }
    setCurrentUser(null);
    setCurrentRoom(null);
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
