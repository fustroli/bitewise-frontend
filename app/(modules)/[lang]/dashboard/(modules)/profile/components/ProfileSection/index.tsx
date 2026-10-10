'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { Edit, Save } from 'lucide-react';
import {
  IUser,
  IUserChange,
} from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import {
  TDictionary,
  useDictionary,
} from '@/app/providers/dictionary-provider';
import { useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import ProfileField from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/ProfileSection/ProfileField';
import { TProfileField } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/interfaces';
import { cn } from '@/app/lib';
import { toastResult } from '@/app/utils/helpers/client';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface IProps<TValues extends FieldValues> {
  title: string;
  description?: string;
  /** Pass a stable (module-level) function; it runs once per dictionary. */
  createSchema: (dictionary: TDictionary) => z.ZodType<TValues, TValues>;
  toFormValues: (user: IUser) => TValues;
  toChange: (values: TValues) => IUserChange;
  fields: TProfileField<TValues>[];
  /** Defaults to `common.savedSuccessfully`. */
  successMessage?: string;
  /** No Edit/Cancel: the fields are always editable and Save is always shown. */
  alwaysEditing?: boolean;
  /** Extra classes for the fields' container. */
  className?: string;
}

/**
 * A card that shows part of the User's Profile and runs its edit → save
 * cycle: Cancel restores the User's values, a failed save stays in edit mode,
 * a successful one updates the User and leaves edit mode.
 */
const ProfileSection = <TValues extends FieldValues>({
  title,
  description,
  createSchema,
  toFormValues,
  toChange,
  fields,
  successMessage,
  alwaysEditing = false,
  className,
}: IProps<TValues>) => {
  const dictionary = useDictionary();
  const { common } = dictionary;
  const { user, updateUser } = useUserContext();
  const [isEditing, setIsEditing] = useState(alwaysEditing);

  const schema = useMemo(
    () => createSchema(dictionary),
    [createSchema, dictionary],
  );

  const savedValues = toFormValues(user);

  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues: savedValues as DefaultValues<TValues>,
  });

  const startEditing = () => {
    form.reset(savedValues);
    setIsEditing(true);
  };

  const cancel = () => {
    form.reset(savedValues);
    setIsEditing(false);
  };

  async function onSubmit(values: TValues) {
    const result = await updateUser(toChange(values));

    if (!toastResult(result, successMessage ?? common.savedSuccessfully)) {
      return;
    }

    form.reset(toFormValues(result.data));
    if (!alwaysEditing) setIsEditing(false);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {!alwaysEditing &&
              (isEditing ? (
                <Button
                  variant="outline"
                  type="button"
                  onClick={cancel}
                  disabled={form.formState.isSubmitting}
                >
                  {common.cancel}
                </Button>
              ) : (
                <Button variant="outline" type="button" onClick={startEditing}>
                  <Edit /> {common.edit}
                </Button>
              ))}
          </CardHeader>
          <CardContent
            className={cn('grid grid-cols-2 gap-y-4 xl:w-3/5', className)}
          >
            {fields.map((field) => (
              <ProfileField
                key={field.name}
                field={field}
                form={form}
                isEditing={isEditing}
                value={savedValues[field.name]}
              />
            ))}
          </CardContent>
          {isEditing && (
            <CardFooter className="justify-end">
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                <Save /> {common.save}
              </LoadingButton>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default ProfileSection;
