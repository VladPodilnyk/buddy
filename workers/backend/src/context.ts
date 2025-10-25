import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

// Dummy context
export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
