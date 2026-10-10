'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Edit, Save } from 'lucide-react';
import {
  TNotificationSettingsSchema,
  createNotificationSettingsSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import InputField from '@/app/components/form/InputField';
import Typography from '@/app/components/Typography';
import { toastResult } from '@/app/utils/helpers/client';
import { updateUser } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/actions';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

const DefaultEmail = () => {
  const { common, profile, validation } = useDictionary();
  const { user, setUser } = useUserContext();

  const currentEmail =
    user?.notificationSettings?.defaultEmailAddress || user?.email;

  const notificationSettingsSchema =
    createNotificationSettingsSchema(validation);

  const form = useForm<TNotificationSettingsSchema>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      defaultEmailAddress: currentEmail,
    },
  });

  async function onSubmit(values: TNotificationSettingsSchema) {
    const result = await updateUser({ notificationSettings: values });

    if (toastResult(result, common.savedSuccessfully)) setUser(result.data);

    setIsEditable(false);
  }

  const [isEditable, setIsEditable] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>{profile.notifications.defaultEmail}</CardTitle>
          <CardDescription>
            {profile.notifications.defaultEmailDesc}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          type={'button'}
          onClick={() => setIsEditable((prev) => !prev)}
        >
          {!isEditable && <Edit />}
          {isEditable ? common.cancel : common.edit}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
            {isEditable ? (
              <div className="max-w-[200px]">
                <InputField
                  form={form}
                  name="defaultEmailAddress"
                  type={'email'}
                />
              </div>
            ) : (
              <Typography variant="p">{currentEmail}</Typography>
            )}
            {isEditable && (
              <Button className="absolute bottom-0 right-0" type="submit">
                <Save /> {common.save}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DefaultEmail;
