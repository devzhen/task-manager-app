import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchBoardMeta from '@/app/api/board/fetchBoardMeta';
import fetchBoardNames from '@/app/api/board/fetchBoardNames';
import AddBoardForm from '@/app/components/AddBoardForm';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import { getDictionary } from '@/app/dictionaries';

import styles from './page.module.css';

type BoardEditPageProps = {
  params: {
    boardId: string;
    lang: string;
  };
};

export default async function BoardEditPage(props: BoardEditPageProps) {
  const { boardId, lang } = props.params;

  const [boardNames, board, boardMeta, dictionary] = await Promise.all([
    fetchBoardNames(),
    fetchBoard(boardId),
    fetchBoardMeta(boardId),
    getDictionary(lang),
  ]);

  if (board === null) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppIntlProvider dictionary={dictionary} locale={lang}>
          <AddBoardForm boards={boardNames} board={board} boardMeta={boardMeta} />
        </AppIntlProvider>
      </div>
    </div>
  );
}
