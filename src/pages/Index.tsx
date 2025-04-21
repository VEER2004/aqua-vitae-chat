
import { ChatWindow } from "@/components/ChatWindow";
import "../assets/styles/main.css";

const Index = () => {
  return (
    <div className="min-h-screen bg-medgreen bg-gradient-to-br from-white via-[#f2fce2] to-[#d3e4fd] flex items-center justify-center px-2">
      <div className="chat-card w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-aqua mb-1 text-center font-sans">Aqua Vitae Chat</h1>
        <p className="text-gray-500 text-center mb-4" style={{fontWeight: 500}}>Welcome 👋 Start your medical chat below</p>
        <ChatWindow />
      </div>
    </div>
  );
};

export default Index;
