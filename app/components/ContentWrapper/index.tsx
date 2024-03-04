import type { ReactNode } from 'react';

import styles from './ContentWrapper.module.css';

type ContentWrapperProps = {
  children: ReactNode;
};

export default async function ContentWrapper(props: ContentWrapperProps) {
  const { children } = props;

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
