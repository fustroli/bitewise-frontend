import { z } from 'zod';

export const createDefaultEmailSchema = (dictionary: Record<string, string>) =>
  z.object({
    defaultEmailAddress: z.string().email(dictionary['emailInvalid']),
  });

export type TDefaultEmailSchema = z.infer<
  ReturnType<typeof createDefaultEmailSchema>
>;

export const emailNotificationsSchema = z.object({
  communicationEmail: z.boolean(),
  marketingEmail: z.boolean(),
  securityEmail: z.boolean(),
});

export type TEmailNotificationsSchema = z.infer<
  typeof emailNotificationsSchema
>;
