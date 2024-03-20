'use client';

import { FormattedMessage } from 'react-intl';

import styles from './NotFoundMessage.module.css';

type NotFoundMessageProps = {
  message: { id: string };
  header?: { id: string };
};

export default function NotFoundMessage(props: NotFoundMessageProps) {
  const { message, header } = props;

  return (
    <div className={styles.container}>
      {header && (
        <h2>
          <FormattedMessage {...header} />
        </h2>
      )}
      <div className={styles.flexContainer}>
        <h3>
          <FormattedMessage {...message} />
        </h3>
      </div>
    </div>
  );
}
