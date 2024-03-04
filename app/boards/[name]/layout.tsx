import { headers } from 'next/headers';

import SideBar from '../../components/SideBar';

import styles from './page.module.css';

const BoardLayout = async () => {
  const requestUrl = headers().get('x-url');

  let boards = [];

  // Fetch available boards
  try {
    const url = new URL(`${requestUrl}/api/board/list`);
    const response = await fetch(url.toString());
    boards = await response.json();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  return (
    <>
      <SideBar boards={boards} />
      <div className={styles.cardsBackground}>
        <div className={styles.cards}></div>
      </div>
    </>
  );
};

export default BoardLayout;
