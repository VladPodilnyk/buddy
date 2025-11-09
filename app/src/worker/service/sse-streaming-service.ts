import { DurableObject } from "cloudflare:workers";
import { SSEStreamingApi } from "hono/streaming";
import { ChatMessage } from "../types";
import streamingUtils from "../utils/streaming";

export class SSEStreamingService extends DurableObject<Env> {
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

  public async broadcast(message: ChatMessage) {
    for (const [_, stream] of this.connections.entries()) {
      stream.writeSSE({
        data: JSON.stringify(message),
        id: `${message.username}-${message.timestamp}`,
      });
    }
  }

  // TODO: implemet init messages fetching
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

    const stream = streamingUtils.getSSEStreamFromRequest(request, {
      onClose: () => {
        this.connections.delete(username);
      },
    });
    this.connections.set(username, stream);

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
