import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';

import { z } from 'zod';

const measurement = z.number().positive().nullable();

/**
 * The shape of an `IUserChange`, checked on the server. The Profile forms
 * check the ranges; this keeps the request to known fields of the right type.
 */
export const userChangeSchema = z.object({
  personalInformation: z
    .object({
      userName: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      dateOfBirth: z.iso.datetime(),
    })
    .partial()
    .optional(),
  socialProfiles: z
    .object({
      facebook: z.string(),
      twitter: z.string(),
      instagram: z.string(),
      linkedin: z.string(),
    })
    .partial()
    .optional(),
  notificationSettings: z
    .object({
      defaultEmailAddress: z.email(),
      communicationEmail: z.boolean(),
      marketingEmail: z.boolean(),
      securityEmail: z.boolean(),
    })
    .partial()
    .optional(),
  bodyStats: z
    .object({
      sex: z.enum(ESex).nullable(),
      heightCm: measurement,
      weightKg: measurement,
      neckCm: measurement,
      waistCm: measurement,
      hipCm: measurement,
      activityLevel: z.enum(EActivityLevel).nullable(),
    })
    .partial()
    .optional(),
});

export const avatarFileSchema = z
  .file()
  .min(1)
  .max(MAX_FILE_SIZE)
  .mime(ACCEPTED_IMAGE_TYPES);
