'use client';

import {
  TPersonalInfoSchema,
  personalInformationSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';
import {
  toPersonalInfoChange,
  toPersonalInfoFormValues,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';

import ProfileSection from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/ProfileSection';
import { useDictionary } from '@/app/providers/dictionary-provider';

const createSchema = () => personalInformationSchema;

const PersonalInformation = () => {
  const { profile } = useDictionary();
  const labels = profile.personalInformation;

  return (
    <ProfileSection<TPersonalInfoSchema>
      title={labels.title}
      createSchema={createSchema}
      toFormValues={toPersonalInfoFormValues}
      toChange={toPersonalInfoChange}
      fields={[
        { kind: 'text', name: 'firstName', label: labels.firstName },
        { kind: 'text', name: 'lastName', label: labels.lastName },
        { kind: 'text', name: 'userName', label: labels.username },
        { kind: 'phone', name: 'phoneNumber', label: labels.phoneNumber },
        { kind: 'date', name: 'dateOfBirth', label: labels.dob },
      ]}
    />
  );
};

export default PersonalInformation;
