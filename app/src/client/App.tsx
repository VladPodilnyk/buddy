import { useState } from "react";
import client from "./api/api";
import { userMessageSchema } from "../worker/validation";
import { z } from "zod";
import { UsernamePicker } from "./components/UsernamePicker";
import { RoomControls } from "./components/RoomControls";
import { Chat } from "./components/Chat";
import { useListenMessages } from "./hooks/useListenMessages";

function App() {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [messageList, setMessageList] = useState<
    Array<z.infer<typeof userMessageSchema>>
  >([]);

  const isChatRoomDisabled = username.length === 0;

  const onRoomIdUpdate = (value: string) => {
    setRoomId(value);
    setMessageList([]);
  };

  const onMessageSend = (message: string) => {
    if (username.length === 0) {
      alert("You should set your username first!!!");
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
      <UsernamePicker onSave={setUsername} />
      <RoomControls onConnect={onRoomIdUpdate} disabled={isChatRoomDisabled} />
      <Chat
        messages={messageList}
        onSend={onMessageSend}
        disabled={isChatRoomDisabled}
      />
    </div>
  );
}

export default App;
