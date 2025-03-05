import { useCallback, useState } from "react";
import { getAuthToken } from "../utils/localStorage";
import { Auth } from "./Auth";
import { Chat } from "./Chat";

// Super fast solution without proper page navigation
export const SimplePageRouter: React.FC = () => {
  const [token, setToken] = useState(getAuthToken());
  const handleToken = useCallback((token: string) => {
    setToken(token);
  }, []);

  if (token) {
    return <Chat token={token} />;
  }
  console.log("auth");
  return <Auth setToken={handleToken} />;
}