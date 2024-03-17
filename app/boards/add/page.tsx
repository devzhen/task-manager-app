import fetchBoards from '@/app/api/board/fetchBoards';
import AddBoardForm from '@/app/components/AddBoardForm';
import type { BoardType } from '@/app/types';

import styles from './page.module.css';

export default async function AddBoardPage() {
  const boards: BoardType[] = await fetchBoards();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Add new board</h2>
        <AddBoardForm boards={boards} />
      </div>
    </div>
  );
}
