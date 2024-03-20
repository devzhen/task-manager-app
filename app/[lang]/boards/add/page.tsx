import fetchBoardNames from '@/app/api/board/fetchBoardNames';
import AddBoardForm from '@/app/components/AddBoardForm';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import { getDictionary } from '@/app/dictionaries';

import styles from './page.module.css';

type BoardAddPageProps = {
  params: {
    lang: string;
  };
};

export default async function AddBoardPage(props: BoardAddPageProps) {
  const { lang } = props.params;

  const [boards, dictionary] = await Promise.all([fetchBoardNames(), getDictionary(lang)]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppIntlProvider dictionary={dictionary} locale={lang}>
          <AddBoardForm boards={boards} />
        </AppIntlProvider>
      </div>
    </div>
  );
}
