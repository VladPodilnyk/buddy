import React, { useCallback, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { trpc } from "../trpc/client";

interface AuthProps {
  setToken: (value: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onUsernameInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    }, []
  );

  const onPasswordInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    }, []
  );

  const handleLogin = useCallback(async () => {
    const response = await trpc.login.mutate({ username, password });
    localStorage.setItem("token", response.value);
    setToken(response.value);
  }, [password, setToken, username]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Hi!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <p>Username</p>
            <Input id="name" onChange={onUsernameInputChange} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <p>Password</p>
            <Input id="password" onChange={onPasswordInputChange} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleLogin}>Login</Button>
      </CardFooter>
    </Card>
  );
}
