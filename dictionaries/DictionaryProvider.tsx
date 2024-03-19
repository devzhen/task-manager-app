import { createContext, type ReactNode } from 'react';

import type { DictionaryType } from '@/app/types';

type DictionaryProviderProps = {
  children: ReactNode;
  dictionary: DictionaryType;
};

export const DictionaryContext = createContext<DictionaryType>({} as DictionaryType);

const DictionaryProvider = (props: DictionaryProviderProps) => {
  const { children, dictionary } = props;

  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>;
};

export default DictionaryProvider;
