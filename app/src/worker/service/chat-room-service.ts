import { AppContext, ChatMessage } from "../types";

function generateRoomId(ctx: AppContext): string {
  return ctx.env.rooms.newUniqueId().toString();
}

function getEventStream(ctx: AppContext): Promise<Response> {
  // TODO: implemet init messages fetching
  const roomId = ctx.env.rooms.idFromString(ctx.req.param("roomId"));
  const stub = ctx.env.rooms.get(roomId);
  return stub.fetch(ctx.req.raw);
}

async function sendMessage(
  ctx: AppContext,
  message: ChatMessage
): Promise<void> {
  const roomId = ctx.env.rooms.idFromString(ctx.req.param("id"));
  const stub = ctx.env.rooms.get(roomId);
  // TODO: persist messages (D1)
  await stub.broadcast(message);
}

export default { generateRoomId, getEventStream, sendMessage };
