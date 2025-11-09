import { ChatMessage } from "../types";

interface ChatMessageRaw {
  participant_id: string;
  message: string;
  created_at: number;
}

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

async function fetchLast(
  db: D1Database,
  chatId: string,
  numberOfRecords: number
): Promise<ChatMessage[]> {
  const data = await db
    .prepare(
      `SELECT participant_id, message, created_at FROM messages 
       WHERE chat_id = ?
       ORDER BY created_at DESC
       LIMIT ?
    `
    )
    .bind(chatId, numberOfRecords)
    .run<ChatMessageRaw>();

  return data.results.reverse().map((v) => ({
    username: v.participant_id,
    message: v.message,
    timestamp: v.created_at,
  }));
}

export default { save, fetchLast };
