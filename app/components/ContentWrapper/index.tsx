import { headers } from 'next/headers';
import type { ReactNode } from 'react';

import SideBar from '../SideBar';

import styles from './ContentWrapper.module.css';

type ContentWrapperProps = {
  children: ReactNode;
};

export default async function ContentWrapper(props: ContentWrapperProps) {
  const { children } = props;

  const requestUrl = headers().get('x-url');
  // Fetch available boards
  const url = new URL(`${requestUrl}api/board/list`);
  const response = await fetch(url.toString());
  const boards = await response.json();

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <div className={styles.content}>
          <SideBar boards={Object.values(boards)} />
          <div className={styles.cardsBackground}>
            <div className={styles.cards}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
