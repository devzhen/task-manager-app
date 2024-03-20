'use client';

import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './AddBoardForm.module.css';

export default function AddBoardFormLoading() {
  return (
    <>
      <h2 className={styles.header}>
        <FormattedMessage id="board.edit" />
      </h2>
      <div className={styles.column}>
        <label htmlFor="board-name">
          <FormattedMessage id="name" />:
        </label>
        <div className={styles.inputWrapper}>
          <span className={classNames('formItemSkeleton', styles.loadingInput)} />
        </div>
        <div className={styles.loadingContainer}>
          <p>
            <FormattedMessage id="statuses" />:
          </p>
          <div className={styles.loadingColumn}>
            <span>
              <FormattedMessage id="name" />
            </span>
            <span className={classNames('formItemSkeleton', styles.loadingStatus)} />
          </div>
          <div className={styles.loadingColumn}>
            <span>
              <FormattedMessage id="name" />
            </span>
            <span className={classNames('formItemSkeleton', styles.loadingStatus)} />
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <p>
            <FormattedMessage id="tags" />:
          </p>
          <div className={styles.loadingColumn}>
            <span>
              <FormattedMessage id="name" />
            </span>
            <span className={classNames('formItemSkeleton', styles.loadingTag)} />
          </div>
          <div className={styles.loadingColumn}>
            <span>
              <FormattedMessage id="name" />
            </span>
            <span className={classNames('formItemSkeleton', styles.loadingTag)} />
          </div>
        </div>
      </div>
    </>
  );
}
