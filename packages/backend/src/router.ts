import express from 'express';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';
import EventEmitter from 'events';
import { sql } from './db';

const t = initTRPC.context<Context>().create();
const trpcRouter = t.router;
const publicProcedure = t.procedure;

const chatEvents = new EventEmitter();
const clients: Map<string, express.Response[]> = new Map();

// Define routes
export const appRouter = trpcRouter({
  sendMessage: publicProcedure
    .input(
      z.object({ chatId: z.string(), senderId: z.string(), receiverId: z.string(), content: z.string() })
    )
    .mutation(async ({ input }) => {
      const message = { ...input, timestamp: new Date().toISOString() };

      await sql`
        INSERT INTO messages (chat_id, sender_id, receiver_id, content, timestamp)
        VALUES (${message.chatId}, ${message.senderId}, ${message.receiverId}, ${message.content}, ${message.timestamp})
      `;

      chatEvents.emit('message', message);
      return message;
    }),

    getMessages: publicProcedure
      .input(z.object({
        chatId: z.string(),
      }))
      .query(async ({ input }) => {
        const messages = await sql`SELECT sender_id, receiver_id, content, timestamp 
          FROM messages WHERE chat_id = ${input.chatId} ORDER BY timestamp ASC
        `;
        return {
          values: messages.map((row) => ({
            senderId: row.sender_id as string,
            receiverId: row.receiver_id as string,
            content: row.content as string,
            timestamp: row.timestamp as string,
          }))
        };
      }),

    getUserChats: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        const rows = await sql`SELECT DISTINCT chat_id FROM messages 
          WHERE sender_id = ${input.userId} OR receiver_id = ${input.userId}
        `;
        return {values: rows.map((row) => row.chat_id as string)};
      }),
});

// Export type router type signature
type AppRouter = typeof appRouter;

const sseRouter = express.Router();
sseRouter.get('/events', (req, res) => {
  const userId = req.query.userId;
  const chatId = req.query.chatId;

  if (!userId || typeof userId !== 'string' || !chatId || typeof chatId !== 'string') {
    res.status(400).send('Missing userId');
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!clients.has(chatId)) {
    clients.set(chatId, []);
  }
  clients.get(chatId)?.push(res);
  
  console.log(`User ${userId} connected to chat ${chatId}`);

  req.on('close', () => {
    const responses = clients.get(userId)?.filter(client => client !== res) ?? [];
    clients.set(userId, responses);
  });
});

const sendMessage = (message: any) => {
  const chatId = message.chatId as string;
  if (clients.get(chatId)) {
    clients.get(chatId)?.forEach((client) => {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
};
chatEvents.on('message', sendMessage);


export { sseRouter, chatEvents, AppRouter };
