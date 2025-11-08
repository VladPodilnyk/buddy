import { DurableObject } from "cloudflare:workers";
import { SSEStreamingApi } from "hono/streaming";
import { userMessageSchema } from "./validation";
import z from "zod";

export class ChatRoomStore extends DurableObject<Env> {
  private connections: Set<SSEStreamingApi>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.connections = new Set();
  }

  public async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith("/connect")) {
      const { readable, writable } = new TransformStream();
      const stream = new SSEStreamingApi(writable, readable);
      this.connections.add(stream);

      const keepAlive = setInterval(() => {
        stream.write(":\n\n");
      }, 1000);

      request.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        this.connections.delete(stream);
        // not really safe, but for toy-like implementation is good enough
        writable.close();
      });

      // Use responseReadable from the stream instead of the original readable
      // This avoids the "disturbed stream" error
      return new Response(stream.responseReadable, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  public async storeConnection(stream: SSEStreamingApi) {
    this.connections.add(stream);
  }

  public async removeConnection(stream: SSEStreamingApi) {
    this.connections.delete(stream);
  }

  public async broadcast(message: z.infer<typeof userMessageSchema>) {
    for (const stream of this.connections) {
      stream.writeSSE({
        event: "chat-event",
        data: JSON.stringify(message),
      });
    }
  }
}
