'use client';

import { FormattedMessage } from 'react-intl';

import styles from './NotFoundMessage.module.css';

type NotFoundMessageProps = {
  message: { id: string };
  header?: { id: string };
  loading?: boolean;
};

export default function NotFoundMessage(props: NotFoundMessageProps) {
  const { message, header, loading } = props;

  return (
    <div className={styles.container}>
      {header && (
        <h2>
          <FormattedMessage {...header} />
        </h2>
      )}
      <div className={styles.flexContainer}>
        {!loading && (
          <h3>
            <FormattedMessage {...message} />
          </h3>
        )}
        {loading && <div className={styles.loader} />}
      </div>
    </div>
  );
}
