import {
  IPasswordPolicyMessages,
  createConfirmPasswordSchema,
  createPasswordSchema,
  passwordsMatch,
} from '@/app/utils/password-policy';
import { z } from 'zod';

export const createResetPasswordSchema = (messages: IPasswordPolicyMessages) =>
  z
    .object({
      password: createPasswordSchema(messages),
      confirmPassword: createConfirmPasswordSchema(messages),
    })
    .refine(...passwordsMatch(messages));

export type TResetPasswordSchema = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
