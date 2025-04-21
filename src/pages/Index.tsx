
import { ChatWindow } from "@/components/ChatWindow";
import { LoginScreen } from "@/components/LoginScreen";
import { ChatProvider, useChatContext } from "@/contexts/ChatContext";
import { RoomList } from "@/components/RoomList";
import "../assets/styles/main.css";

// This is a wrapper component that shows either the login screen or chat window
const ChatApp = () => {
  const { currentUser } = useChatContext();
  
  return (
    <div className="chat-app">
      {!currentUser ? (
        <LoginScreen />
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="md:hidden mb-4">
            <RoomList />
          </div>
          <ChatWindow />
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-medgreen bg-gradient-to-br from-white via-[#f2fce2] to-[#d3e4fd] flex items-center justify-center px-2 py-4">
        <div className="chat-card w-full max-w-5xl">
          <h1 className="text-3xl font-semibold text-aqua mb-1 text-center font-sans">Aqua Vitae Chat</h1>
          <p className="text-gray-500 text-center mb-4" style={{fontWeight: 500}}>
            Welcome 👋 Join a room and start chatting
          </p>
          <ChatApp />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
