'use client';

import Image from 'next/image';
import { useController, type UseControllerProps } from 'react-hook-form';
import Select from 'react-select';

import type { AddCardFormInputs } from '../types';

import styles from './TagsSelect.module.css';

type TagsSelectProps = UseControllerProps<AddCardFormInputs> & {
  tags: AddCardFormInputs['tags'];
};

export default function TagsSelect(props: TagsSelectProps) {
  const { tags } = props;

  const { field } = useController<AddCardFormInputs, 'tags'>({
    name: 'tags',
    control: props.control,
  });

  return (
    <>
      <label htmlFor="card-status">Tags:</label>
      <Select
        options={tags}
        id="card-tags"
        aria-activedescendant={undefined}
        classNamePrefix="card-select"
        isSearchable={false}
        isMulti
        components={{
          MultiValue: ({ data, getValue, setValue: setMultipleValue }) => {
            return (
              <div className={styles.tag} style={{ backgroundColor: data.color }}>
                <span style={{ color: data.fontColor }}>{data.label}</span>
                <div
                  className={styles.tagClear}
                  onClick={(e) => {
                    e.stopPropagation();
                    const filtered = getValue().filter((option) => option.id !== data.id);
                    setMultipleValue(filtered, 'deselect-option');
                  }}
                  role="presentation"
                >
                  <Image src="/close.svg" width={12} height={12} alt="Img" draggable={false} />
                </div>
              </div>
            );
          },
          Option: ({ data, selectOption }) => {
            return (
              <div className={styles.option} onClick={() => selectOption(data)} role="presentation">
                <div className={styles.optionCircle} style={{ backgroundColor: data.color }} />
                <span>{data.label}</span>
              </div>
            );
          },
        }}
        {...field}
      />
    </>
  );
}
