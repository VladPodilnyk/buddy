import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Define routes
export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name}!`,
      };
    }),
});

// Export type router type signature
export type AppRouter = typeof appRouter;
