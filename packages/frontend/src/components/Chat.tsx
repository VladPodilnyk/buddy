import { useEffect, useState } from 'react';
import { trpc } from '../trpc/client';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export default function Chat({ userId, receiverId }: { userId: string; receiverId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // const sendMessage = trpc.sendMessage.useMutation();

  useEffect(() => {
    const eventSource = new EventSource('/events');
    eventSource.onmessage = (event) => {
      console.log('Received message:', event.data);
      const message: Message = JSON.parse(event.data);
      if ((message.senderId === userId && message.receiverId === receiverId) ||
          (message.senderId === receiverId && message.receiverId === userId)) {
        setMessages((prev) => [...prev, message]);
      }
    };

    return () => eventSource.close();
  }, [userId, receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await trpc.sendMessage.mutate({ senderId: userId, receiverId, content: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.senderId === userId ? 'right' : 'left' }}>
            <p><strong>{msg.senderId}</strong>: {msg.content}</p>
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}
