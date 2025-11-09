import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { connectMessageSchema, userMessageSchema } from "./validation";
import { AppBindings } from "./types";
import { SSEStreamingService } from "./service/sse-streaming-service";
import chatRoomService from "./service/chat-room-service";

const app = new Hono<{ Bindings: AppBindings }>()
  .get("/room", async (c) => {
    const roomId = chatRoomService.generateRoomId(c);
    return c.json({ roomId }, 200);
  })
  .get(
    "/room/:roomId/connect",
    zValidator("query", connectMessageSchema),
    async (c) => {
      return chatRoomService.getEventStream(c);
    }
  )
  .post("/room/:id/send", zValidator("json", userMessageSchema), async (c) => {
    const message = c.req.valid("json");
    await chatRoomService.sendMessage(c, message);
    return c.json({}, 200);
  });

export default app;
export type AppType = typeof app;
export { SSEStreamingService }; // To make bindings work
