import SideBar from '@/app/components/SideBar';
import Statuses from '@/app/components/Statuses';

import styles from './page.module.css';

export default async function CardPage() {
  return (
    <>
      <SideBar initialBoards={boards} />
      <div className={styles.cardsBackground}>
        <Statuses boards={boards} />
      </div>
    </>
  );
}
