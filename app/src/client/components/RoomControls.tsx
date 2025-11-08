import { FC, useState } from "react";
import { useCreateRoom } from "../hooks/useCreateRoom";

interface RoomControlsProps {
  disabled?: boolean;
  onConnect: (value: string) => void;
}

export const RoomControls: FC<RoomControlsProps> = (props) => {
  const [displayRoomId, setRoomId] = useState("");
  const newRoom = useCreateRoom();

  const onRoomIdInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  const onCreateClick = async () => {
    const roomId = await newRoom();
    setRoomId(roomId ?? "");
  };

  const onConnectClick = () => {
    if (displayRoomId.length === 0) {
      alert("Enter RoomID first");
      return;
    }
    props.onConnect(displayRoomId);
  };

  return (
    <div className="room-controls">
      <div className="room-controls-buttons">
        <button onClick={onCreateClick} disabled={props.disabled}>
          Create
        </button>
        <button onClick={onConnectClick} disabled={props.disabled}>
          Connect
        </button>
      </div>
      <input
        value={displayRoomId}
        onChange={onRoomIdInputChange}
        disabled={props.disabled}
      />
    </div>
  );
};
