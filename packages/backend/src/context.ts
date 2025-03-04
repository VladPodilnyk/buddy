import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

// Create context for each request
export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
    // You can add more context values here, like:
    // db: your-database-connection,
    // user: get-authenticated-user(req)
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
