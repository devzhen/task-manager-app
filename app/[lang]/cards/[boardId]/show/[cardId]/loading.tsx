import AddCardFormLoading from '@/app/components/AddCardForm/loading';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import getLangAndDictionaryFromHeaders from '@/app/utils/getLangAndDictionaryFromHeaders';

import styles from './page.module.css';

export default async function Loading() {
  const { locale, dictionary } = await getLangAndDictionaryFromHeaders();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppIntlProvider dictionary={dictionary} locale={locale}>
          <AddCardFormLoading />
        </AppIntlProvider>
      </div>
    </div>
  );
}
