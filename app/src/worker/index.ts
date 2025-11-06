import { Hono } from "hono";
import { ChatRoomStore } from "./ChatRoomStore";

type Bindings = {
  db: D1Database;
  rooms: DurableObjectNamespace<ChatRoomStore>;
};

const app = new Hono<{ Bindings: Bindings }>().get("/api", async (c) => {
  const id = c.env.rooms.idFromName(new URL(c.req.url).pathname);
  const stub = c.env.rooms.get(id);
  const result = await stub.sayHello();
  return c.json({ name: result });
});

export default app;
export type AppType = typeof app;
export { ChatRoomStore }; // To make bindings work
