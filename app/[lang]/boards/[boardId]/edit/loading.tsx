import AppIntlProvider from '@/app/components/AppIntlProvider';
import NotFoundMessage from '@/app/components/NotFoundMessage';
import getLangAndDictionaryFromHeaders from '@/app/utils/getLangAndDictionaryFromHeaders';

import styles from './page.module.css';

export default async function Loading() {
  const { locale, dictionary } = await getLangAndDictionaryFromHeaders();

  return (
    <div className={styles.container}>
      <AppIntlProvider dictionary={dictionary} locale={locale}>
        <NotFoundMessage message={{ id: 'board.notExist' }} header={{ id: 'board.edit' }} loading />
      </AppIntlProvider>
    </div>
  );
}
