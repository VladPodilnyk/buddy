import { Hono } from "hono";
import { ChatRoomStore } from "./ChatRoomStore";
import { streamSSE } from "hono/streaming";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Bindings = {
  db: D1Database;
  rooms: DurableObjectNamespace<ChatRoomStore>;
};

const requestQueue: string[] = [];

const app = new Hono<{ Bindings: Bindings }>()
  .get("/api", async (c) => {
    const pathname = new URL(c.req.url).pathname;
    const id = c.env.rooms.idFromName(pathname);
    const stub = c.env.rooms.get(id);
    const result = await stub.sayHello();
    return c.json({ name: result });
  })
  .get("/sse", async (c) => {
    return streamSSE(c, async (stream) => {
      while (requestQueue.length) {
        const message = requestQueue.shift()!;
        await stream.writeSSE({
          data: `Echo: ${message}`,
          id: Date.now().toString(),
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    });
  })
  .post(
    "/echo",
    zValidator("json", z.object({ msg: z.string() }).strict()),
    async (c) => {
      const { msg } = c.req.valid("json");
      requestQueue.push(msg);
      return c.json({});
    }
  );

export default app;
export type AppType = typeof app;
export { ChatRoomStore }; // To make bindings work
