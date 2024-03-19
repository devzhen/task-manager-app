'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useController, type UseControllerProps } from 'react-hook-form';
import Select from 'react-select';

import type { AddCardFormInputs } from '../types';

import styles from './TagsSelect.module.css';

type TagsSelectProps = UseControllerProps<AddCardFormInputs> & {
  tags: AddCardFormInputs['tags'];
};

export default function TagsSelect(props: TagsSelectProps) {
  const { tags } = props;

  const selectRef = useRef<HTMLSelectElement>();

  const { field } = useController<AddCardFormInputs, 'tags'>({
    name: 'tags',
    control: props.control,
  });

  return (
    <>
      <label htmlFor="card-status">Tags:</label>
      <Select
        {...field}
        ref={selectRef as unknown as VoidFunction}
        options={tags}
        id="card-tags"
        aria-activedescendant={undefined}
        classNamePrefix="card-select"
        isSearchable={false}
        isMulti
        onChange={(option, { action }) => {
          field.onChange(option);

          // Not good approach
          if (action === 'remove-value' || action === 'clear' || action === 'select-option') {
            setTimeout(() => selectRef.current?.blur(), 1);
          }
        }}
        components={{
          MultiValueContainer: ({ data, children, ...innerProps }) => {
            return (
              <div className={styles.tag} style={{ backgroundColor: data.color }} {...innerProps}>
                {children}
              </div>
            );
          },
          MultiValueLabel: ({ data }) => {
            return <span style={{ color: data.fontColor }}>{data.label}</span>;
          },
          MultiValueRemove: ({ innerProps }) => {
            return (
              <div {...innerProps} className={styles.tagClear}>
                <Image src="/close.svg" width={12} height={12} alt="Img" draggable={false} />
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
      />
    </>
  );
}
