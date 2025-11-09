import { useState } from "react";
import client from "./api/api";
import { userMessageSchema } from "../worker/validation";
import { z } from "zod";
import { UsernamePicker } from "./components/UsernamePicker";
import { RoomControls } from "./components/RoomControls";
import { Chat } from "./components/Chat";
import { useListenMessages } from "./hooks/useListenMessages";
import { ChatMessage } from "../worker/types";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messageList, setMessageList] = useState<Array<ChatMessage>>([]);

  const isChatRoomDisabled = username === null;

  const onEditUsername = (value: string | null) => {
    if (value !== username) {
      setRoomId(null);
      setMessageList([]);
      setUsername(value);
    }
  };

  const onRoomIdUpdate = (value: string) => {
    setRoomId(value);
    setMessageList([]);
  };

  const onRoomExit = () => {
    setRoomId(null);
    setMessageList([]);
  };

  const onMessageSend = (message: string) => {
    if (username === null || roomId === null) {
      return;
    }

    client.room[":id"].send.$post({
      param: { id: roomId },
      json: {
        username,
        message,
        timestamp: Date.now(),
      },
    });
  };

  const onMessageReceive = (event: MessageEvent) => {
    const data = z.parse(userMessageSchema, JSON.parse(event.data));
    setMessageList((v) => [...v, data]);
  };

  useListenMessages({
    roomId,
    username,
    onEvent: onMessageReceive,
  });

  return (
    <div className="container">
      <h3>Buddy</h3>
      <UsernamePicker onSave={onEditUsername} />
      <RoomControls
        onConnect={onRoomIdUpdate}
        onExit={onRoomExit}
        disabled={isChatRoomDisabled}
      />
      <Chat
        messages={messageList}
        onSend={onMessageSend}
        disabled={isChatRoomDisabled}
      />
    </div>
  );
}

export default App;
