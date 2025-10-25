import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter, sseRouter } from './router';
import { createContext } from './context';
import { PREDEFINED_USERS } from './repository/db';
import { UserRepository } from './repository/UserRepository';
import { hashPassword } from './domain/utils';

// hardcoded for now
const PORT = 4000;

// Seed users
PREDEFINED_USERS.forEach((userData) => {
  const hashedPass = hashPassword(userData.password);
  UserRepository.getByName(userData.username).then((row) => {
    if (!row) {
      UserRepository.insert(userData.username, hashedPass).catch((error) => {
        console.log(`failed to seed users: ${error.message}`);
        process.exit(1);
      });
    }
  });
})

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
// Setup SSE router
app.use(sseRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
