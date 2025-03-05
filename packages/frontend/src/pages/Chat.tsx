import React, { useCallback, useEffect, useState } from "react";
import { trpc } from "../trpc/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";

interface Message {
  sender: string;
  receiver: string;
  message: string;
}

interface ChatProps {
  token: string;
}

export const Chat: React.FC<ChatProps> = ({ token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  const fetchUserChats = useCallback(async () => {
    const response = await trpc.getUserChats.query({ token });
    setChats(response.active_chats);
    if (response.active_chats.length > 0) {
        setActiveChat(response.active_chats[0]);
    }
  
    const { users } = await trpc.getUsers.query({ token });
    setUsers(users);
  }, [token]);

  const fetchActiveChatMessages = useCallback(async () => {
    if (!activeChat) {
      return;
    };

    const response = await trpc.getMessages.query({ token, receiver: activeChat });
    setMessages(response.messages);
  }, [activeChat, token]);


  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  useEffect(() => {
    fetchActiveChatMessages();

    const eventSource = new EventSource(`/events?token=${token}`);
    eventSource.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => eventSource.close();
  }, [activeChat, fetchActiveChatMessages, token]);

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() && activeChat) {
      await trpc.sendMessage.mutate({
        token,
        receiver: activeChat,
        message: newMessage,
      });
      setNewMessage("");
    }
  }, [activeChat, newMessage, token]);

  return (
    <div className="flex h-screen">
      {/* Sidebar (Chat List) */}
      <div className="border-r p-4">
        <h3 className="text-lg font-bold mb-4">Chats</h3>
        
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500">No chats available</p>
          ) : (
            chats.map((chat) => (
              <Card
                key={chat}
                onClick={() => setActiveChat(chat)}
                className={`p-2 cursor-pointer ${activeChat === chat ? "bg-gray-200" : ""}`}
              >
                {chat}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className="p-6 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">Chat: {activeChat || "Select a chat"}</h3>
        <div className="flex-1 overflow-y-auto border rounded p-4 h-96">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.receiver !== activeChat ? "text-left" : "text-right"}`}>
              <p className="text-sm font-bold">{msg.sender}</p>
              <p className="inline-block bg-gray-200 px-3 py-1 rounded-lg">{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="ml-2">Send</Button>
        </div>
      </div>
    </div>
  );
}
