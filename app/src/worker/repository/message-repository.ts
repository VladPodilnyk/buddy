import { ChatMessage } from "../types";

async function save(
  db: D1Database,
  chatId: string,
  message: ChatMessage
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO messages (chat_id, participant_id, message, created_at) VALUES (?, ?, ?, ?)`
    )
    .bind(chatId, message.username, message.message, message.timestamp)
    .run();
}

function fetchLast(numberOfRecords: number): Promise<ChatMessage> {
  throw new Error("Not implemented");
}

export default { save, fetchLast };
