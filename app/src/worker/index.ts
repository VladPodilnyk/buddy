import { Hono } from "hono";
import { ChatRoomStore } from "./ChatRoomStore";
import { zValidator } from "@hono/zod-validator";
import { connectMessageSchema, userMessageSchema } from "./validation";

type Bindings = {
  db: D1Database;
  rooms: DurableObjectNamespace<ChatRoomStore>;
};

const app = new Hono<{ Bindings: Bindings }>()
  .get("/room", async (c) => {
    const roomId = c.env.rooms.newUniqueId().toString();
    return c.json({ roomId }, 200);
  })
  .get(
    "/room/:roomId/connect",
    zValidator("param", connectMessageSchema),
    async (c) => {
      // TODO: implemet init messages fetching
      const roomId = c.env.rooms.idFromString(c.req.param("roomId"));
      const stub = c.env.rooms.get(roomId);
      return stub.fetch(c.req.raw);
    }
  )
  .post("/room/:id/send", zValidator("json", userMessageSchema), async (c) => {
    const roomId = c.env.rooms.idFromString(c.req.param("id"));
    const stub = c.env.rooms.get(roomId);
    const message = c.req.valid("json");
    // TODO: persist messages
    await stub.broadcast(message);
    return c.json({}, 200);
  });

export default app;
export type AppType = typeof app;
export { ChatRoomStore }; // To make bindings work
