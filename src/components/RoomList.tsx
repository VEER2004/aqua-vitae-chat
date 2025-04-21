
import React, { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RoomList() {
  const { rooms, currentRoom, joinRoom, createRoom } = useChatContext();
  const [newRoomName, setNewRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      createRoom(newRoomName);
      setNewRoomName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="room-list p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-700">Chat Rooms</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCreating(!isCreating)}
          className="text-aqua hover:text-aqua/80 hover:bg-aqua-light/50"
        >
          <Plus size={18} />
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateRoom} className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="text-sm"
              autoFocus
            />
            <Button type="submit" variant="outline" size="sm">
              Create
            </Button>
          </div>
        </form>
      )}

      <ScrollArea className="h-[350px] pr-3">
        <div className="space-y-1">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                currentRoom?.id === room.id
                  ? "bg-aqua-light text-aqua font-medium"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => joinRoom(room.id)}
            >
              <span className="text-sm">{room.name}</span>
              <div className="flex items-center text-xs text-gray-500">
                <Users size={14} className="mr-1" />
                <span>{room.users}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
