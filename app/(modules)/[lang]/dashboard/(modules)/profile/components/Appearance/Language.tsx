'use client';

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

import SettingsRow from '@/app/(modules)/[lang]/dashboard/(modules)/profile/components/SettingsRow';
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
    <SettingsRow
      title={profile.appearance.language}
      description={profile.appearance.languageDesc}
    >
      <div className="rounded-lg border bg-card p-4 md:p-6">
        <Select value={lang} onValueChange={handleChange}>
          <SelectTrigger
            className="w-full sm:w-[220px]"
            aria-label={profile.appearance.language}
          >
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
      </div>
    </SettingsRow>
  );
};

export default Language;
