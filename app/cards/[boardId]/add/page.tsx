import fetchBoard from '@/app/api/board/fetchBoard';
import AddCardForm from '@/app/components/AddCardForm';

import styles from './page.module.css';

type AddPageProps = {
  params: {
    boardId: string;
  };
};

export default async function AddPage(props: AddPageProps) {
  const {
    params: { boardId },
  } = props;

  const board = await fetchBoard(boardId);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Add Task</h2>
        <AddCardForm board={board} />
      </div>
    </div>
  );
}
