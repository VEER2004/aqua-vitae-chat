
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/contexts/ChatContext";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setUsername: setContextUsername } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    
    // Username validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    if (username.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }
    
    // Set username in the chat context
    setContextUsername(username);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-2 border-aqua-light">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-aqua">Join Aqua Vitae Chat</CardTitle>
          <CardDescription>Enter a username to start chatting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                autoFocus
              />
              {error && <p className="text-destructive text-sm mt-1">{error}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-tr from-[#33C3F0] to-[#D3E4FD] hover:opacity-90"
            >
              Join Chat
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Connect with healthcare professionals and patients
        </CardFooter>
      </Card>
    </div>
  );
}
