import {
  EActivityLevel,
  ESex,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/enums';

export interface IPersonalInformation {
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  /** ISO date-time; only its UTC calendar date is meaningful. */
  dateOfBirth?: string;
}

export interface ISocialProfiles {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface INotificationSettings {
  /** Where emails are sent; the sign-in email when unset. */
  defaultEmailAddress?: string;
  communicationEmail?: boolean;
  marketingEmail?: boolean;
  securityEmail?: boolean;
}

/** Metric, as currently recorded; any field may be unset. */
export interface IBodyStats {
  sex: ESex | null;
  heightCm: number | null;
  weightKg: number | null;
  neckCm: number | null;
  waistCm: number | null;
  hipCm: number | null;
  activityLevel: EActivityLevel | null;
}

export interface IUser {
  id: number;
  email: string;
  /** Whether the User has completed Email verification. */
  emailVerified?: boolean;
  /** False for a User who only signs in with Google; they can't change email. */
  hasPassword?: boolean;
  /** The unconfirmed new address of a pending Email change. */
  pendingEmail?: string | null;
  /** ISO date-time the pending Email change expires. */
  pendingEmailExpiresAt?: string | null;
  personalInformation?: IPersonalInformation;
  socialProfiles?: ISocialProfiles;
  notificationSettings?: INotificationSettings;
  bodyStats?: IBodyStats;
  avatarUrl?: string;
}

/** A partial update of the User's Profile, as sent to the backend. */
export interface IUserChange {
  personalInformation?: IPersonalInformation;
  socialProfiles?: ISocialProfiles;
  notificationSettings?: INotificationSettings;
  bodyStats?: Partial<IBodyStats>;
}

export interface IEmailChangeRequest {
  newEmail: string;
  password: string;
}
