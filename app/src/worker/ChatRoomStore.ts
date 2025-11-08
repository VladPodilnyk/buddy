import { DurableObject } from "cloudflare:workers";
import { SSEStreamingApi } from "hono/streaming";
import { userMessageSchema } from "./validation";
import z from "zod";

export class ChatRoomStore extends DurableObject<Env> {
  private connections: Map<string, SSEStreamingApi>;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.connections = new Map<string, SSEStreamingApi>();
  }

  public async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/connect")) {
      return this.establishSSEConnection(request, url.searchParams);
    }
    return Promise.resolve(new Response("Not found", { status: 404 }));
  }

  public async broadcast(message: z.infer<typeof userMessageSchema>) {
    for (const [_, stream] of this.connections.entries()) {
      stream.writeSSE({
        data: JSON.stringify(message),
        id: `${message.username}-${message.timestamp}`,
      });
    }
  }

  private async establishSSEConnection(
    request: Request,
    params: URLSearchParams
  ): Promise<Response> {
    // There is not need to validate username here, since it has been done by Hono API.
    const username = params.get("username");
    if (username === null) {
      return new Response("Internal Server Error", { status: 500 });
    }

    if (this.connections.has(username)) {
      return new Response(
        "A user with exect same username exists in the room",
        { status: 400 }
      );
    }

    const { readable, writable } = new TransformStream();
    const stream = new SSEStreamingApi(writable, readable);
    this.connections.set(username, stream);

    const keepAlive = setInterval(() => {
      stream.write(":\n\n");
    }, 1000);

    request.signal.addEventListener("abort", () => {
      clearInterval(keepAlive);
      this.connections.delete(username);
      // not really safe, but for a toy-like implementation is good enough
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
}
