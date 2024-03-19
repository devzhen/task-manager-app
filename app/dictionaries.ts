import 'server-only';
import { LOCALE } from './constants';
import type { DictionaryType } from './types';

export const dictionaries = {
  [LOCALE.enUS]: () =>
    import('../dictionaries/en').then((module) => module.default as DictionaryType),
  [LOCALE.frFr]: () =>
    import('../dictionaries/fr').then((module) => module.default as DictionaryType),
} as const;

export const getDictionary = async (locale: string) => {
  const key = locale as keyof typeof dictionaries;

  return dictionaries[key]();
};
