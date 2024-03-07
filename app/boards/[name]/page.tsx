import { headers } from 'next/headers';

import SideBar from '@/app/components/SideBar';
import Statuses from '@/app/components/Statuses';
import { BoardType } from '@/app/types';

import styles from './page.module.css';

export default async function Home() {
  const requestUrl = headers().get('x-url');

  // Fetch available boards
  const fetchBoards = async () => {
    'use server';

    let data = [];

    try {
      const url = new URL(`${requestUrl}/api/board/list`);
      const response = await fetch(url.toString(), { cache: 'no-store' });
      data = await response.json();

      if (data.error) {
        // eslint-disable-next-line no-console
        console.log('Fetch boards error - ', data.error);
        data = [];
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Fetch boards error - ', err);
    } finally {
      return data;
    }
  };

  const boards: BoardType[] = await fetchBoards();

  return (
    <>
      <SideBar initialBoards={boards} requestUrl={requestUrl as string} />
      <div className={styles.cardsBackground}>
        <Statuses />
      </div>
    </>
  );
}
