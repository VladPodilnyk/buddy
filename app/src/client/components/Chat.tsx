import { FC, useState, useRef, useEffect } from "react";
import { z } from "zod";
import { userMessageSchema } from "../../worker/validation";

interface ChatProps {
  messages: Array<z.infer<typeof userMessageSchema>>;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const Chat: FC<ChatProps> = (props) => {
  const [message, setMessage] = useState("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const onMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onSendClick = () => {
    if (message.trim().length === 0) {
      return;
    }
    props.onSend(message);
    setMessage("");
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendClick();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [props.messages]);

  return (
    <div className="chat">
      <div className="chat-window" ref={chatWindowRef}>
        {props.messages.map((msg, index) => (
          <div
            key={`${msg.username}-${msg.timestamp}-${index}`}
            className="chat-message"
          >
            <span className="chat-username">{msg.username}:</span>
            <span className="chat-text">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          disabled={props.disabled}
          placeholder="Type a message..."
        />
        <button
          onClick={onSendClick}
          disabled={props.disabled || message.trim().length === 0}
        >
          Send
        </button>
      </div>
    </div>
  );
};
