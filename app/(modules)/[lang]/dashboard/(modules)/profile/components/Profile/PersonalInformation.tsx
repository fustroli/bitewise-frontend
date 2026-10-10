'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Edit, Save } from 'lucide-react';
import {
  TPersonalInfoSchema,
  personalInformationSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations/personal-information.validation';

import { Button } from '@/app/components/ui/button';
import DateInfoBox from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/DateInfobox';
import { Form } from '@/app/components/ui/form';
import InfoBox from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/InfoBox';
import PhoneInfoBox from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/Profile/PhoneInfoBox';
import { getDefaultValues } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';
import { set } from 'date-fns';
import { toastResult } from '@/app/utils/helpers/client';
import { updateUser } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/actions';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

const PersonalInformation = () => {
  const { common, profile } = useDictionary();
  const [isEditable, setIsEditable] = useState(false);
  const { user, setUser } = useUserContext();

  const form = useForm<TPersonalInfoSchema>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: getDefaultValues(user),
  });

  async function onSubmit(values: TPersonalInfoSchema) {
    if (values.dateOfBirth) {
      values.dateOfBirth = set(values.dateOfBirth, { hours: 12 });
    }

    const result = await updateUser({ personalInformation: values });

    if (toastResult(result, common.savedSuccessfully)) setUser(result.data);

    setIsEditable(false);
  }

  return (
    <Card>
      <Form {...form}>
        <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{profile.personalInformation.title}</CardTitle>
            <Button
              variant="outline"
              type={'button'}
              onClick={() => setIsEditable((prev) => !prev)}
            >
              {!isEditable && <Edit />}
              {isEditable ? common.cancel : common.edit}
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-4 xl:w-3/5">
            <InfoBox<TPersonalInfoSchema>
              label={profile.personalInformation.firstName}
              info={user?.personalInformation?.firstName || ''}
              name="firstName"
              isEditable={isEditable}
              form={form}
            />
            <InfoBox<TPersonalInfoSchema>
              label={profile.personalInformation.lastName}
              name="lastName"
              info={user?.personalInformation?.lastName || ''}
              isEditable={isEditable}
              form={form}
            />
            <InfoBox<TPersonalInfoSchema>
              label={profile.personalInformation.username}
              name="userName"
              info={user?.personalInformation?.userName || ''}
              isEditable={isEditable}
              form={form}
            />
            <PhoneInfoBox
              label={profile.personalInformation.phoneNumber}
              info={user?.personalInformation?.phoneNumber || ''}
              isEditable={isEditable}
              form={form}
            />
            <DateInfoBox
              label={profile.personalInformation.dob}
              info={
                user?.personalInformation?.dateOfBirth &&
                new Date(user?.personalInformation?.dateOfBirth)
              }
              isEditable={isEditable}
              form={form}
            />

            {isEditable && (
              <Button className="absolute bottom-6 right-6" type="submit">
                <Save /> {common.save}
              </Button>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default PersonalInformation;
