import { Context } from "hono";
import { SSEStreamingService } from "./service/sse-streaming-service";

export type AppBindings = {
  db: D1Database;
  rooms: DurableObjectNamespace<SSEStreamingService>;
};

export type AppContext = Context<{ Bindings: AppBindings }>;

export interface ChatMessage {
  username: string;
  message: string;
  timestamp: number;
}
