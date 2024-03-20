'use client';

import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './AddCardForm.module.css';

export default function AddCardLoadingForm() {
  return (
    <>
      <h2 className={classNames(styles.header, styles.loadingHeader)}>
        <FormattedMessage id="card.details" />
      </h2>
      <div className={styles.column}>
        <label htmlFor="card-name">
          <FormattedMessage id="title" />:
        </label>
        <div className={styles.inputWrapper}>
          <span className={classNames('formItemSkeleton', styles.loadingTitle)} />
        </div>
        <label htmlFor="card-description">
          <FormattedMessage id="description" />:
        </label>
        <div className={styles.textAreWrapper}>
          <span className={classNames('formItemSkeleton', styles.loadingDescription)} />
        </div>
      </div>
      <div className={styles.loadingColumn}>
        <label htmlFor="card-status">
          <FormattedMessage id="status" />:
        </label>
        <span className={classNames('formItemSkeleton', styles.loadingStatus)} />
        <label htmlFor="card-status">
          <FormattedMessage id="tags" />:
        </label>
        <span className={classNames('formItemSkeleton')} />
      </div>
      <div className={styles.loadingRow}>
        <p>
          <FormattedMessage id="attachments" />:
        </p>
        <p>
          <FormattedMessage id="attachments.restriction" />
        </p>
        <span className={classNames('formItemSkeleton', styles.loadingAttachment)} />
      </div>
    </>
  );
}
