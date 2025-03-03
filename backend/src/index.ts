import express from 'express';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

const app = express();
const t = initTRPC.create();

const router = t.router({
  greeting: t.procedure
    .query(() => 'Hello from tRPC!'),
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router,
  })
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export type AppRouter = typeof router;