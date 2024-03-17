import AddBoardForm from '@/app/components/AddBoardForm';

import styles from './page.module.css';

export default async function AddBoardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Add new board</h2>
        <AddBoardForm />
      </div>
    </div>
  );
}
