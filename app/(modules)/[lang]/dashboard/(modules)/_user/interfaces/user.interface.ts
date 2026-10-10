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

export interface IUser {
  id: number;
  email: string;
  personalInformation?: IPersonalInformation;
  socialProfiles?: ISocialProfiles;
  notificationSettings?: INotificationSettings;
  avatarUrl?: string;
}

/** A partial update of the User's Profile, as sent to the backend. */
export interface IUserChange {
  personalInformation?: IPersonalInformation;
  socialProfiles?: ISocialProfiles;
  notificationSettings?: INotificationSettings;
}
