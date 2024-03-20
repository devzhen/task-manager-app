import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { headers as nextHeaders } from 'next/headers';

import { DEFAULT_LOCALE, LOCALE } from '../constants';
import { getDictionary } from '../dictionaries';
import type { DictionaryType } from '../types';

const getLangAndDictionary = async (): Promise<{ locale: string; dictionary: DictionaryType }> => {
  const headersList = nextHeaders();

  const headers: Record<string, string> = {};
  headersList.forEach((value, key) => {
    headers[key] = value;
  });

  const languages = new Negotiator({ headers }).languages();

  const locale = match(languages, Object.values(LOCALE), DEFAULT_LOCALE);

  const dictionary = await getDictionary(locale);

  return {
    locale,
    dictionary,
  };
};

export default getLangAndDictionary;
