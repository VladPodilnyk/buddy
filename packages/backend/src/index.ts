import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter, sseRouter } from './router';
import { createContext } from './context';

// hardcoded for now
const PORT = 4000;

const app = express();


app.use(cors());
app.use(express.json());

// Setup tRPC
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.use(sseRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
