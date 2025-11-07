import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";
import client from "./api/api";

function App() {
  const [name, setName] = useState("unknown");
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://hono.dev/" target="_blank">
          <img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
        </a>
        <a href="https://workers.cloudflare.com/" target="_blank">
          <img
            src={cloudflareLogo}
            className="logo cloudflare"
            alt="Cloudflare logo"
          />
        </a>
      </div>
      <h1>Vite + React + Hono + Cloudflare</h1>
      <div className="card">
        <button
          onClick={() => {
            client.api
              .$get()
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
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
