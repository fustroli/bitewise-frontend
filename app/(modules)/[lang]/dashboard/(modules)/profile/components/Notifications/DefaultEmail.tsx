'use client';

import {
  TDefaultEmailSchema,
  createDefaultEmailSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import {
  TDictionary,
  useDictionary,
} from '@/app/providers/dictionary-provider';
import {
  toDefaultEmailFormValues,
  toNotificationSettingsChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';

import ProfileSection from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/ProfileSection';

const createSchema = (dictionary: TDictionary) =>
  createDefaultEmailSchema(dictionary.validation);

const DefaultEmail = () => {
  const { profile } = useDictionary();

  return (
    <ProfileSection<TDefaultEmailSchema>
      title={profile.notifications.defaultEmail}
      description={profile.notifications.defaultEmailDesc}
      createSchema={createSchema}
      toFormValues={toDefaultEmailFormValues}
      toChange={toNotificationSettingsChange}
      fields={[{ kind: 'email', name: 'defaultEmailAddress' }]}
    />
  );
};

export default DefaultEmail;
