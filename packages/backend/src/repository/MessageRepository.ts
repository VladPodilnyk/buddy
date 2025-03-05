import { SendMessageData } from "../models/models";
import { sql } from "./db";

export class MessageRepository {
    public static async insert(data: MessageData): Promise<void> {
        await sql`
            INSERT INTO messages (sender, receiver, message, created_at)
            VALUES (${data.sender}, ${data.receiver}, ${data.message}, ${data.createdAt})
        `;
    }

    public static async getMessages(sender: string, receiver: string): Promise<SendMessageData[]> {
        const rows = await sql`
            SELECT sender, receiver, message
            FROM messages
            WHERE (sender = ${sender} AND receiver = ${receiver}) OR (sender = ${receiver} AND receiver = ${sender})
            ORDER BY created_at ASC
        `;
        return Array.from(rows.values()) as SendMessageData[];
    }

    // FIXME: probably not the best way to do that
    public static async getReceivers(username: string): Promise<string[]> {
        const rows = await sql`
            SELECT DISTINCT ON (LEAST(sender, receiver), GREATEST(sender, receiver)) sender, receiver
            FROM messages
            WHERE sender = ${username} OR receiver = ${username}
            ORDER BY LEAST(sender, receiver), GREATEST(sender, receiver), created_at DESC
        `;
        
        const result: string[] = Array.from(rows.values()).map((row) => {
            if (row.sender === username) {
                return row.receiver;
            }
            return row.sender;
        })
        return result;
    }
}

interface MessageData extends SendMessageData {
    createdAt: number;
}