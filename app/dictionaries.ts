import 'server-only';
import { LOCALE } from './constants';

export const dictionaries = {
  [LOCALE.enUS]: () => import('../dictionaries/en.json').then((module) => module.default),
  [LOCALE.frFr]: () => import('../dictionaries/fr.json').then((module) => module.default),
} as const;

export const getDictionary = async (locale: string) => {
  const key = locale as keyof typeof dictionaries;

  return dictionaries[key]();
};
