'use client';
import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import type { DictionaryType } from '@/app/types';

type AppIntlProviderProps = {
  children: ReactNode;
  locale: string;
  dictionary: DictionaryType;
};

export default function AppIntlProvider(props: AppIntlProviderProps) {
  const { children, dictionary, locale } = props;

  return (
    <IntlProvider messages={dictionary} locale={locale} defaultLocale="en">
      <>{children}</>
    </IntlProvider>
  );
}
