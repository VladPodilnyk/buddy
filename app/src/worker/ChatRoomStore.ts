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
