import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
