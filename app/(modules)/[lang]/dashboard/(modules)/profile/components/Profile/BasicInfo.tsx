'use client';

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
import { useMemo, useState } from 'react';

import { ACCEPTED_IMAGE_TYPES } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/constants';
import { Button } from '@/app/components/ui/button';
import FileUploadFormField from '@/app/components/form/FileUploadFormField';
import { Form } from '@/app/components/ui/form';
import LoadingButton from '@/app/components/buttons/LoadingButton';
import UserAvatar from '@/app/(modules)/[lang]/dashboard/(modules)/_user/components/UserAvatar';
import dynamic from 'next/dynamic';
import { readableAvatarResult } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';
import { toastResult } from '@/app/utils/helpers/client';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useForm } from 'react-hook-form';
import { useUserContext } from '@/app/(modules)/[lang]/dashboard/(modules)/_user/context';
import { zodResolver } from '@hookform/resolvers/zod';

const loadImageCropDialog = () =>
  import('@/app/components/dialogs/ImageCropDialog');

/** Holds the Crop button's place while react-easy-crop loads. */
const CropButtonFallback = () => {
  const { common } = useDictionary();

  return (
    <Button variant="outline" disabled>
      {common.crop}
    </Button>
  );
};

/** Only needed once an image is picked, so react-easy-crop loads lazily. */
const ImageCropDialog = dynamic(loadImageCropDialog, {
  loading: CropButtonFallback,
});

const BasicInfo = () => {
  const { common, validation, emailVerification } = useDictionary();
  const { user, updateAvatar } = useUserContext();
  // The backend refuses avatars until Email verification; the banner resends.
  const avatarLocked = user?.emailVerified === false;

  const [isEditable, setIsEditable] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const imageSchema = useMemo(
    () => createImageSchema(validation),
    [validation],
  );

  const form = useForm<TImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: { file: null },
  });

  async function onSubmit(values: TImageSchema) {
    const formData = new FormData();
    formData.append('file', values.file);

    const result = readableAvatarResult(
      await updateAvatar(formData),
      validation.imageRejected,
    );

    if (!toastResult(result, common.savedSuccessfully)) return;

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
          {user && <UserAvatar user={user} className="size-16" />}
          <CardHeader>
            <CardTitle className="flex items-center justify-between font-medium">
              {user?.personalInformation?.firstName}{' '}
              {user?.personalInformation?.lastName}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            {avatarLocked && (
              <p className="text-sm text-muted-foreground">
                {emailVerification.avatarLocked}
              </p>
            )}
          </CardHeader>
        </div>
      ) : (
        <Form {...form}>
          <form className="relative" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-end gap-4">
              <FileUploadFormField
                name="file"
                control={form.control}
                label={common.profileImage}
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                changeHandler={handleImageChange}
              />
              <LoadingButton
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
          // Fetch the cropper while the user picks a file.
          if (!isEditable) void loadImageCropDialog();
          setImagePreviewUrl(null);
          setIsEditable((prev) => !prev);
        }}
        disabled={form.formState.isSubmitting || avatarLocked}
      >
        {!isEditable && <Edit />}
        {isEditable ? common.cancel : common.edit}
      </Button>
    </Card>
  );
};

export default BasicInfo;
