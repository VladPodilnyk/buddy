import { useEffect, useState } from "react";
import client from "./api/api";
import { userMessageSchema } from "../worker/validation";
import { z } from "zod";

function App() {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [echoMsgList, setEchoMsgList] = useState<
    Array<z.infer<typeof userMessageSchema>>
  >([]);

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const onConnectInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setRoomId(event.target.value);

  const onCreateRoom = async () => {
    const res = await client.room.$get();
    const data = await res.json();
    setRoomId(data.roomId);
  };

  const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(event.target.value);

  const onMessageSend = () => {
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

  useEffect(() => {
    if (roomId.length === 0) {
      return;
    }

    const eventSource = new EventSource(`/room/${roomId}/connect`);
    eventSource.onmessage = (event) => {
      console.log(event);
      const data = z.parse(userMessageSchema, event.data);
      setEchoMsgList((v) => [...v, data]);
    };
    return () => eventSource.close();
  }, [roomId]);

  return (
    <div className="container">
      <h1>Buddy chat room</h1>
      <div className="labeled-input">
        <p>Username: </p>
        <input value={username} onChange={onUsernameChange} />
      </div>
      <div className="create-room">
        <button onClick={onCreateRoom}>Create</button>
        {roomId && <p>{roomId}</p>}
      </div>
      <div className="labeled-input">
        <p>Connect: </p>
        <input value={roomId} onChange={onConnectInputChange} />
        {/* <button onClick={onMessageSend}>Connect</button> */}
      </div>
      <div>
        <p>Message: </p>
        <input value={message} onChange={onMessageChange} />
        <button onClick={onMessageSend}>Send</button>
        <p>Events: </p>
        {echoMsgList.map((v) => (
          <div id={`${v.username}-${v.timestamp}`}>
            {v.username}: {v.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
