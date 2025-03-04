import { useCallback, useEffect, useState } from "react";
import { trpc } from "../trpc/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Dialog, DialogTrigger, DialogContent } from "../components/Dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/Select";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface User {
  id: string;
  username: string;
}

export function Chat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  // const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUserChats = useCallback(async () => {
    const response = await trpc.getUserChats.query({ userId });
    setChats(response.values);
    if (response.values.length > 0) {
        setActiveChat(response.values[0]);
    }
  
    // await trpc.getUsers.query().then((data) => setUsers(data));
  }, [userId]);


  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  useEffect(() => {
    if (!activeChat) {
        return;
    };

    trpc.getMessages.query({ chatId: activeChat }).then((rsp) => {
      setMessages(rsp.values);
    });

    const eventSource = new EventSource(`/events?userId=${userId}&chatId=${activeChat}`);
    eventSource.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => eventSource.close();
  }, [activeChat, userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      const [userA, userB] = activeChat.split("-");
      const receiverId = userA === userId ? userB : userA;

      await trpc.sendMessage.mutate({
        senderId: userId,
        receiverId,
        content: newMessage,
        chatId: activeChat,
      });

      setNewMessage("");
    }
  };

//   const handleStartChat = () => {
//     if (!selectedUser) return;
//     startChat.mutate(
//       { userId1: userId, userId2: selectedUser },
//       {
//         onSuccess: (data) => {
//           if (!chats.includes(data.chatId)) {
//             setChats([...chats, data.chatId]);
//           }
//           setActiveChat(data.chatId);
//         },
//       }
//     );
//   };

  return (
    <div className="flex h-screen">
      {/* Sidebar (Chat List) */}
      <div className="w-1/4 border-r p-4">
        <h3 className="text-lg font-bold mb-4">Chats</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mb-4">Start New Chat</Button>
          </DialogTrigger>
          <DialogContent>
            <h4 className="text-md font-semibold">Select a User</h4>
            <Select onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="mt-4 w-full" onClick={() => { console.log("click.") }}>Start Chat</Button>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {chats.length === 0 ? (
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
      <div className="w-3/4 p-6 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">Chat: {activeChat || "Select a chat"}</h3>
        <div className="flex-1 overflow-y-auto border rounded p-4 h-96">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.senderId === userId ? "text-right" : "text-left"}`}>
              <p className="text-sm font-bold">{msg.senderId}</p>
              <p className="inline-block bg-gray-200 px-3 py-1 rounded-lg">{msg.content}</p>
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
