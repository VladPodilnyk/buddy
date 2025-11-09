import { useCallback } from "react";
import client from "../api/api";

export const useCreateRoom = () => {
  const newRoom = useCallback(async () => {
    const res = await client.room.$get();
    if (!res.ok) {
      alert("Unexpected error happend when creating a room");
      return null;
    }
    const data = await res.json();
    return data.roomId;
  }, []);

  return newRoom;
};
