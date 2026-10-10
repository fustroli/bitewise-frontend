'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import { ETheme } from '@/app/(modules)/[lang]/dashboard/(modules)/profile/enum';
import { useDictionary } from '@/app/providers/dictionary-provider';
import { useTheme } from 'next-themes';

const Theme = () => {
  const { profile } = useDictionary();
  const { setTheme, theme } = useTheme();

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{profile.appearance.theme}</CardTitle>
        <CardDescription>{profile.appearance.themeDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* `theme` is undefined until next-themes mounts; '' shows the placeholder. */}
        <Select value={theme ?? ''} onValueChange={setTheme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={profile.appearance.theme} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ETheme.LIGHT}>
              {profile.appearance.light}
            </SelectItem>
            <SelectItem value={ETheme.DARK}>
              {profile.appearance.dark}
            </SelectItem>
            <SelectItem value={ETheme.SYSTEM}>
              {profile.appearance.system}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default Theme;
