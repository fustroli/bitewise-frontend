'use client';

import Link from 'next/link';
import { useDictionary } from '@/app/providers/dictionary-provider';

interface IProps {
  href: string;
}
const UpgradeCard = ({ href }: IProps) => {
  const { dashboard } = useDictionary();

  return (
    <div className="relative overflow-hidden rounded-lg bg-primary p-4 text-primary-foreground shadow-primary">
      <div className="absolute -bottom-8 -right-8 size-24 rounded-full bg-white/15" />
      <div className="absolute -right-2 -top-6 size-14 rounded-full bg-white/10" />
      <p className="relative mb-4 text-sm font-semibold leading-snug">
        {dashboard.sidebar.upgradeTitle}
      </p>
      <Link
        href={href}
        className="relative inline-flex h-8 items-center rounded-md bg-white px-4 text-xs font-semibold text-foreground transition-opacity hover:opacity-90"
      >
        {dashboard.sidebar.upgradeButton}
      </Link>
    </div>
  );
};

export default UpgradeCard;
