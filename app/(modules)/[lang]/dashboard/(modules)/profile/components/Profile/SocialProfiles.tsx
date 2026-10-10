'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Edit, Save } from 'lucide-react';
import {
  TSocialProfilesSchema,
  createSocialProfilesSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import InfoBox from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/InfoBox';
import { addHttps } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';
import { toastResult } from '@/app/utils/helpers/client';
import { updateUser } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/actions';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

const SocialProfiles = () => {
  const { common, profile, validation } = useDictionary();
  const [isEditable, setIsEditable] = useState(false);
  const { user, setUser } = useUserContext();

  const socialProfilesSchema = createSocialProfilesSchema(validation);

  const form = useForm<TSocialProfilesSchema>({
    resolver: zodResolver(socialProfilesSchema),
    defaultValues: user.socialProfiles || {},
  });

  async function onSubmit(values: TSocialProfilesSchema) {
    const result = await updateUser({ socialProfiles: values });

    if (toastResult(result, common.savedSuccessfully)) setUser(result.data);

    setIsEditable(false);
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, value } = e.target;
    const updatedValue = addHttps(value);

    form.setValue(name as keyof TSocialProfilesSchema, updatedValue, {
      shouldValidate: true,
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{profile.socialProfiles.title}</CardTitle>
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
            <InfoBox<TSocialProfilesSchema>
              label="Facebook"
              name="facebook"
              info={user?.socialProfiles?.facebook}
              isEditable={isEditable}
              form={form}
              onBlur={handleBlur}
            />
            <InfoBox<TSocialProfilesSchema>
              label="Twitter"
              name="twitter"
              info={user?.socialProfiles?.twitter}
              isEditable={isEditable}
              form={form}
              onBlur={handleBlur}
            />
            <InfoBox<TSocialProfilesSchema>
              label="Instagram"
              name="instagram"
              info={user?.socialProfiles?.instagram}
              isEditable={isEditable}
              form={form}
              onBlur={handleBlur}
            />
            <InfoBox<TSocialProfilesSchema>
              label="LinkedIn"
              name="linkedin"
              info={user?.socialProfiles?.linkedin}
              isEditable={isEditable}
              form={form}
              onBlur={handleBlur}
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

export default SocialProfiles;
