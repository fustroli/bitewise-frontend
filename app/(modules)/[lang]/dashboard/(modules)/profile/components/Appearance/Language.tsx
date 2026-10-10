'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  LANGUAGE_TEXT_KEYS,
  switchLocalePath,
} from '@/app/(modules)/[lang]/dashboard/(modules)/profile/helpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { TLocale, locales } from '@/app/i18n/settings';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useDictionary } from '@/app/providers/dictionary-provider';

const Language = () => {
  const { profile } = useDictionary();
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useParams<{ lang: TLocale }>();

  const handleChange = (value: TLocale) => {
    router.push(switchLocalePath(pathname, value));
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{profile.appearance.language}</CardTitle>
        <CardDescription>{profile.appearance.languageDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={lang} onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={profile.appearance.language} />
          </SelectTrigger>
          <SelectContent>
            {locales.map((locale) => (
              <SelectItem key={locale} value={locale}>
                {profile.appearance[LANGUAGE_TEXT_KEYS[locale]]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default Language;
