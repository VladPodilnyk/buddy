import { AppContext, ChatMessage } from "../types";
import messageRepository from "../repository/message-repository";

function generateRoomId(ctx: AppContext): string {
  return ctx.env.rooms.newUniqueId().toString();
}

function getEventStream(ctx: AppContext): Promise<Response> {
  const roomId = ctx.env.rooms.idFromString(ctx.req.param("roomId"));
  const stub = ctx.env.rooms.get(roomId);
  return stub.fetch(ctx.req.raw);
}

async function sendMessage(
  ctx: AppContext,
  message: ChatMessage
): Promise<void> {
  const roomIdRaw = ctx.req.param("id");
  const roomId = ctx.env.rooms.idFromString(roomIdRaw);
  const stub = ctx.env.rooms.get(roomId);
  await messageRepository.save(ctx.env.db, roomIdRaw, message);
  await stub.broadcast(message);
}

export default { generateRoomId, getEventStream, sendMessage };
