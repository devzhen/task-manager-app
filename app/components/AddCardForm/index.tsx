'use client';
import Select from 'react-select';

import styles from './AddCardForm.module.css';

type AddCardFormProps = {
  statuses: any[];
  tags: any[];
};

export default function AddCardForm(props: AddCardFormProps) {
  const { statuses, tags } = props;

  return (
    <>
      <div className={styles.column}>
        <label htmlFor="card-name">Title:</label>
        <div className={styles.inputWrapper}>
          <input type="text" id="card-name" className={styles.input} />
        </div>
        <label htmlFor="card-description">Description:</label>
        <div className={styles.textAreWrapper}>
          <textarea id="card-description" rows={6} className={styles.textarea} />
        </div>
      </div>
      <div className={styles.column}>
        <label htmlFor="card-status">Status:</label>
        <Select
          options={statuses}
          id="card-status"
          classNamePrefix="card-select"
          isSearchable={false}
        />
        <label htmlFor="card-status">Tags:</label>
        <Select
          options={tags}
          id="card-tags"
          classNamePrefix="card-select"
          isSearchable={false}
          isMulti
        />
      </div>
      <div className={styles.row}></div>
    </>
  );
}
