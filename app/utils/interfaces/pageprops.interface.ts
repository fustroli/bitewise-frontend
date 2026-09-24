import { TLocale } from '@/app/i18n/settings';

export interface IPageProps {
  params: Promise<{
    lang: TLocale;
    [key: string]: string | string[] | undefined;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
