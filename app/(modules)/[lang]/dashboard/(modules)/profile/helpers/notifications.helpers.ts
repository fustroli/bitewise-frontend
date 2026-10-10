import {
  IUser,
  IUserChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import {
  TDefaultEmailSchema,
  TEmailNotificationsSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';

export const toDefaultEmailFormValues = (user: IUser): TDefaultEmailSchema => ({
  defaultEmailAddress:
    user.notificationSettings?.defaultEmailAddress || user.email,
});

export const toEmailNotificationsFormValues = (
  user: IUser,
): TEmailNotificationsSchema => ({
  communicationEmail: user.notificationSettings?.communicationEmail ?? false,
  marketingEmail: user.notificationSettings?.marketingEmail ?? false,
  securityEmail: user.notificationSettings?.securityEmail ?? true,
});

export const toNotificationSettingsChange = (
  notificationSettings: TDefaultEmailSchema | TEmailNotificationsSchema,
): IUserChange => ({ notificationSettings });
