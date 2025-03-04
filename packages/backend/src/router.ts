import express from 'express';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';
import EventEmitter from 'events';

const t = initTRPC.context<Context>().create();
const trpcRouter = t.router;
const publicProcedure = t.procedure;

const chatEvents = new EventEmitter();
const clients: Map<string, express.Response[]> = new Map();

// Define routes
export const appRouter = trpcRouter({
  sendMessage: publicProcedure
    .input(
      z.object({ senderId: z.string(), receiverId: z.string(), content: z.string() })
    )
    .mutation(({ input }) => {
      const message = { ...input, timestamp: new Date().toISOString() };
      chatEvents.emit('message', message);
      return message;
    }),

    fetchMessages: publicProcedure.query(() => {
      // TODO: Fetch messages from database
      return [];
    }),
});

// Export type router type signature
type AppRouter = typeof appRouter;

const sseRouter = express.Router();
sseRouter.get('/events', (req, res) => {
  const userId = req.query.userId;
  if (!userId || typeof userId !== 'string') {
    res.status(400).send('Missing userId');
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!clients.has(userId)) {
    clients.set(userId, []);
  }
  clients.get(userId)?.push(res);

  req.on('close', () => {
    const responses = clients.get(userId)?.filter(client => client !== res) ?? [];
    clients.set(userId, responses);
  });
});

const sendMessage = (message: any) => {
  const { senderId, receiverId } = message;
  [senderId, receiverId].forEach((id) => {
    clients.get(id)?.forEach((client) => {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  });
};
chatEvents.on('message', sendMessage);


export { sseRouter, chatEvents, AppRouter };
