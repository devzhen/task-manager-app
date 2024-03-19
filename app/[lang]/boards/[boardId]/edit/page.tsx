import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchBoardMeta from '@/app/api/board/fetchBoardMeta';
import fetchBoardNames from '@/app/api/board/fetchBoardNames';
import AddBoardForm from '@/app/components/AddBoardForm';

import styles from './page.module.css';

type BoardEditPageProps = {
  params: {
    boardId: string;
  };
};

export default async function BoardEditPage(props: BoardEditPageProps) {
  const { boardId } = props.params;

  const [boardNames, board, boardMeta] = await Promise.all([
    fetchBoardNames(),
    fetchBoard(boardId),
    fetchBoardMeta(boardId),
  ]);

  if (board === null) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Edit board</h2>
        <AddBoardForm boards={boardNames} board={board} boardMeta={boardMeta} />
      </div>
    </div>
  );
}
