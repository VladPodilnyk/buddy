import { useEffect } from "react";

interface UseListenMessagesProps {
  roomId: string | null;
  username: string | null;
  onEvent: (event: MessageEvent) => void;
}

export const useListenMessages = (props: UseListenMessagesProps) => {
  const { roomId, username, onEvent } = props;

  useEffect(() => {
    if (roomId === null || username === null) {
      return;
    }

    const eventSource = new EventSource(
      `/room/${roomId}/connect?username=${username}`
    );
    eventSource.onmessage = onEvent;
    return () => eventSource.close();
  }, [roomId, username]);
};
