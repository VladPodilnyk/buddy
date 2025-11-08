import { z } from "zod";

const usernameSchema = z.string().min(5).max(15);
const connectMessageSchema = z.object({ username: usernameSchema }).strict();
const userMessageSchema = z.object({
  username: usernameSchema,
  message: z.string().min(1).max(100),
  timestamp: z.number(),
});

export { usernameSchema, connectMessageSchema, userMessageSchema };
