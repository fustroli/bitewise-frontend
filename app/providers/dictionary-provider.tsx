'use client';

import React from 'react';
import { getDictionary } from '@/app/i18n/dictionaries';

export type TDictionary = Awaited<ReturnType<typeof getDictionary>>;
const DictionaryContext = React.createContext<TDictionary | null>(null);

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: TDictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = React.useContext(DictionaryContext);
  if (!dictionary) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return dictionary;
}
