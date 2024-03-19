import fetchBoard from '@/app/api/board/fetchBoard';
import AddCardForm from '@/app/components/AddCardForm';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import { getDictionary } from '@/app/dictionaries';

import styles from './page.module.css';

type AddPageProps = {
  params: {
    boardId: string;
    lang: string;
  };
};

export default async function AddPage(props: AddPageProps) {
  const {
    params: { boardId, lang },
  } = props;

  const [board, dictionary] = await Promise.all([fetchBoard(boardId), getDictionary(lang)]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppIntlProvider dictionary={dictionary} locale={lang}>
          <AddCardForm board={board} />
        </AppIntlProvider>
      </div>
    </div>
  );
}
