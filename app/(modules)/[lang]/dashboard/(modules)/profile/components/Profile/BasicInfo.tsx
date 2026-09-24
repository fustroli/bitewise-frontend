'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Edit, Upload } from 'lucide-react';
import {
  TImageSchema,
  createImageSchema,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/validations';

import { ACCEPTED_IMAGE_TYPES } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/constants';
import { Button } from '@/app/components/ui/button';
import FileUploadFormField from '@/app/components/form/FileUploadFormField';
import { Form } from '@/app/components/ui/form';
import { IUser } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/interfaces';
import ImageCropDialog from '@/app/components/dialogs/ImageCropDialog';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import { handleError } from '@/app/utils/helpers';
import { updateProfilePicture } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/actions';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

const BasicInfo = () => {
  const { common, validation } = useDictionary();
  const { user, setUser } = useUserContext();

  const [isEditable, setIsEditable] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const imageSchema = createImageSchema(validation);

  const form = useForm<TImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: { file: null },
  });

  async function onSubmit(values: TImageSchema) {
    try {
      const formData = new FormData();
      formData.append('file', values.file);

      const result = await updateProfilePicture(formData);
      setUser(result.data as IUser);
    } catch (error: unknown) {
      handleError(error);
    }

    setImagePreviewUrl(null);
    setIsEditable(false);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    form.setValue('file', selectedFile);
    if (selectedFile) {
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Card className="relative flex min-h-32 w-full items-center justify-between p-6">
      {!isEditable ? (
        <div className="flex items-center">
          <Avatar className="size-16">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>
              {/* Plain img: Radix allows only one AvatarImage per Avatar */}
              <img
                src="https://github.com/shadcn.png"
                alt=""
                className="aspect-square size-full"
              />
            </AvatarFallback>
          </Avatar>
          <CardHeader>
            <CardTitle className="flex items-center justify-between font-medium">
              {user?.personalInformation?.firstName}{' '}
              {user?.personalInformation?.lastName}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
        </div>
      ) : (
        <Form {...form}>
          <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-end gap-4">
              <FileUploadFormField
                id="avatar"
                name="file"
                form={form}
                label={common.profileImage}
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                changeHandler={handleImageChange}
              />
              <LoadingButton
                variant="outline"
                type={'submit'}
                disabled={!imagePreviewUrl}
                loading={form.formState.isSubmitting}
              >
                <Upload /> {common.upload}
              </LoadingButton>
              {imagePreviewUrl && (
                <ImageCropDialog
                  file={imagePreviewUrl}
                  onSave={(croppedFile) => {
                    form.setValue('file', croppedFile);
                    setImagePreviewUrl(URL.createObjectURL(croppedFile));
                  }}
                />
              )}
            </div>
          </form>
        </Form>
      )}

      <Button
        variant="outline"
        type={'button'}
        onClick={() => {
          setImagePreviewUrl(null);
          setIsEditable((prev) => !prev);
        }}
        disabled={form.formState.isSubmitting}
      >
        {!isEditable && <Edit />}
        {isEditable ? common.cancel : common.edit}
      </Button>
    </Card>
  );
};

export default BasicInfo;
