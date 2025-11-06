import { z } from 'zod';

export const sendMessageValidator = z.object({
  token: z.string(),
  receiver: z.string(),
  message: z.string() 
});

export const getMessagesValidator = z.object({
  token: z.string(),
  receiver: z.string(),
});

export const getUserTokenValidator = z.object({
  token: z.string(),
});

export const loginDataValidator = z.object({
  username: z.string(),
  password: z.string().min(3),
});
