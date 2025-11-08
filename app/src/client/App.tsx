import { useEffect, useState } from "react";
import "./App.css";
import client from "./api/api";

function App() {
  const [message, setMessage] = useState("");
  const [echoMsgList, setEchoMsgList] = useState<Array<{ value: string }>>([]);

  const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(event.target.value);

  const onMessageSend = () => {
    client.echo.$post({ json: { msg: message } });
  };

  useEffect(() => {
    const eventSource = new EventSource("/sse");
    eventSource.onmessage = (event) => {
      console.log("DEUBG >>> ", event.data);
      setEchoMsgList((v) => [...v, { value: event.data }]);
    };
    return () => eventSource.close();
  }, []);

  return (
    <>
      <h1>Buddy chat room</h1>
      <div className="card">
        <button onClick={onMessageSend}>Send</button>
      </div>
      <div className="card">
        <p>Message: </p>
        <input value={message} onChange={onMessageChange} />
        <p>Events: </p>
        {echoMsgList.map((v, index) => (
          <div id={index.toString()}>{v.value}</div>
        ))}
      </div>
    </>
  );
}

export default App;
