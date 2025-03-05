import express from 'express';
import { initTRPC } from '@trpc/server';
import { Context } from './context';
import { getMessagesValidator, getUserTokenValidator, loginDataValidator, sendMessageValidator } from './validators/validators';
import { AuthService } from './services/AuthService';
import { ChatService } from './services/ChatService';
import { EventHandler } from './domain/EventHandler';
import { verifyToken } from './domain/utils';

const t = initTRPC.context<Context>().create();
const trpcRouter = t.router;
const publicProcedure = t.procedure;

const clients: Map<string, express.Response> = new Map();
const eventHandler = EventHandler.init(clients);
const chatService = new ChatService(eventHandler);

// Define routes
export const appRouter = trpcRouter({
  login: publicProcedure
    .input(loginDataValidator)
    .mutation(async ({ input }) => {
      const response = await AuthService.login(input.username, input.password);
      return response;
    }),

  sendMessage: publicProcedure
    .input(sendMessageValidator)
    .mutation(async ({ input }) => {
      const { username } = verifyToken(input.token); // better put this to a middleware
      await chatService.sendMessage({...input, sender: username});
    }),

  getMessages: publicProcedure
    .input(getMessagesValidator)
    .query(async ({ input }) => {
      const { username } = verifyToken(input.token);
      const messages = await chatService.getMessages(username, input.receiver);
      return { messages };
    }),

  getUserChats: publicProcedure
    .input(getUserTokenValidator)
    .query(async ({ input }) => {
      const { username } = verifyToken(input.token);
      const activeChats = await chatService.getUserChats(username);
      return { active_chats: activeChats };
    }),

  getUsers: publicProcedure
    .input(getUserTokenValidator)
    .query(async ({ input }) => {
      const { username } = verifyToken(input.token);
      const users = await chatService.getUsers();
      return { users: users.filter((v) => v !== username )};
    })
});

// Export type router type signature
type AppRouter = typeof appRouter;

const sseRouter = express.Router();
sseRouter.get('/events', (req, res) => {
  const token = req.query.token;
  if (!token || typeof token !== 'string') {
    res.status(400).send('Missing token');
    return;
  }
  const { username } = verifyToken(token);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!clients.has(username)) {
    clients.set(username, res);
  }

  console.log(`Established connection with user ${username}`);

  req.on('close', () => {
    clients.delete(username);
  });
});

export { sseRouter, AppRouter };
