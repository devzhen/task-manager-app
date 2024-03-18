import fetchBoardNames from '@/app/api/board/fetchBoardNames';
import AddBoardForm from '@/app/components/AddBoardForm';

import styles from './page.module.css';

export default async function AddBoardPage() {
  const boards: { id: string; name: string }[] = await fetchBoardNames();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Add new board</h2>
        <AddBoardForm boards={boards} />
      </div>
    </div>
  );
}
