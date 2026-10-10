import { z } from 'zod';

export const personalInformationSchema = z.object({
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.date().optional(),
});

export type TPersonalInfoSchema = z.infer<typeof personalInformationSchema>;
