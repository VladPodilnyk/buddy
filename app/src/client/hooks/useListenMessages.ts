import { useEffect } from "react";

interface UseListenMessagesProps {
  roomId: string;
  username: string;
  onEvent: (event: MessageEvent) => void;
}

export const useListenMessages = (props: UseListenMessagesProps) => {
  const { roomId, username, onEvent } = props;

  useEffect(() => {
    if (roomId.length === 0 || username.length === 0) {
      return;
    }

    const eventSource = new EventSource(
      `/room/${roomId}/connect?username=${username}`
    );
    eventSource.onmessage = onEvent;
    return () => eventSource.close();
  }, [roomId, username]);
};
