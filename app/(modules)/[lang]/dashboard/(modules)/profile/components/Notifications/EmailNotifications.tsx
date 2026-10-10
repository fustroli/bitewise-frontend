'use client';

import {
  TEmailNotificationsSchema,
  emailNotificationsSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import {
  toEmailNotificationsFormValues,
  toNotificationSettingsChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';

import ProfileSection from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/ProfileSection';
import { useDictionary } from '@/app/providers/dictionary-provider';

const createSchema = () => emailNotificationsSchema;

const EmailNotifications = () => {
  const { profile } = useDictionary();
  const labels = profile.notifications;

  return (
    <ProfileSection<TEmailNotificationsSchema>
      title={labels.emailNotifications}
      description={labels.emailNotificationsDesc}
      createSchema={createSchema}
      toFormValues={toEmailNotificationsFormValues}
      toChange={toNotificationSettingsChange}
      successMessage={labels.updateSuccess}
      alwaysEditing
      className="grid-cols-1 gap-y-8 xl:w-full"
      fields={[
        {
          kind: 'switch',
          name: 'communicationEmail',
          label: labels.communicationEmail,
          description: labels.communicationEmailDesc,
        },
        {
          kind: 'switch',
          name: 'marketingEmail',
          label: labels.marketingEmail,
          description: labels.marketingEmailDesc,
        },
        {
          kind: 'switch',
          name: 'securityEmail',
          label: labels.securityEmail,
          description: labels.securityEmailDesc,
          disabled: true,
        },
      ]}
    />
  );
};

export default EmailNotifications;
