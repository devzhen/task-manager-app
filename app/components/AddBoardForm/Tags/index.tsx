import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';
import { v4 as uuid } from 'uuid';

import ModalColor from '@/app/components/ModalColor';
import usePrevious from '@/app/hooks/usePrevious';
import type { BoardType } from '@/app/types';

import type { AddBoardFormInputs } from '../types';

import styles from './Tags.module.css';

type TagsProps = {
  name: string;
  board: BoardType | undefined;
};

export default function Tags(props: TagsProps) {
  const { name, board } = props;

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { register, trigger, getValues, formState } = useFormContext();

  const [modalColorState, setModalColorState] = useState<{
    isOpened: boolean;
    index: number | undefined;
    fieldName: string | undefined;
    fieldValue: string | undefined;
  }>({
    isOpened: false,
    index: undefined,
    fieldName: undefined,
    fieldValue: undefined,
  });

  const { fields, append, update, remove } = useFieldArray<
    AddBoardFormInputs,
    'tags',
    'formFieldId'
  >({
    name: 'tags',
    keyName: 'formFieldId',
  });
  const fieldsLengthPrev = usePrevious(fields.length);

  const { append: appendDeletedTags } = useFieldArray<
    AddBoardFormInputs,
    'deletedTags',
    'formFieldId'
  >({
    name: 'deletedTags',
    keyName: 'formFieldId',
  });

  /**
   * Add a new tag
   */
  const addNewTag = () => {
    append({ id: uuid(), name: '', color: undefined, fontColor: undefined, isNew: true });

    trigger();
  };

  /**
   * Set a modal visibility
   */
  const setModalColorVisibility =
    ({
      isOpened,
      index,
      fieldName,
      fieldValue,
    }: {
      isOpened: boolean;
      index: number | undefined;
      fieldName: string | undefined;
      fieldValue: string | undefined;
    }) =>
    () => {
      setModalColorState((prev) => ({
        ...prev,
        isOpened,
        index,
        fieldName,
        fieldValue,
      }));
    };

  /**
   * Choose a color
   */
  const onChooseColor = (hex: string) => {
    if (modalColorState.index !== undefined && modalColorState.fieldName) {
      const item = getValues().tags[modalColorState.index];
      item[modalColorState.fieldName] = hex;

      update(modalColorState.index, item);
      trigger(name);

      setModalColorState({
        isOpened: false,
        index: undefined,
        fieldName: undefined,
        fieldValue: undefined,
      });
    }
  };

  /**
   * Delete a tag
   */
  const deleteTag = (index: number, tag: AddBoardFormInputs['tags']['0']) => () => {
    if (board) {
      appendDeletedTags({ id: tag.id });
    }

    remove(index);
    trigger(name);
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

  /**
   * Lifecycle
   */
  useEffect(() => {
    // If new field was added
    if (fieldsLengthPrev && fields.length > fieldsLengthPrev) {
      // Scroll
      if (buttonRef.current && 'scrollIntoView' in buttonRef.current) {
        buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [fields.length, fieldsLengthPrev]);

  return (
    <div className={styles.container}>
      <p>Tags:</p>
      <div className={styles.errorWrapper}>
        <ErrorMessage
          errors={formState.errors}
          name={'tags'}
          render={({ message }) => <span className={styles.error}>{message}</span>}
        />
      </div>
      {fields.map((tag, index) => {
        return (
          <div className={styles.statusRow} key={tag.id}>
            <div className={styles.column}>
              <span>
                <FormattedMessage id="name" />
              </span>
              <input
                type="text"
                readOnly={tag.isNew !== true}
                {...register(`tags.${index}.name` as const)}
                style={{
                  backgroundColor: tag.color,
                  color: tag.fontColor,
                  caretColor: tag.fontColor,
                }}
              />
              <ErrorMessage
                errors={formState.errors}
                name={`tags.${index}.name`}
                render={({ message }) => <span className={styles.error}>{message}</span>}
              />
            </div>
            <div
              className={styles.column}
              role="presentation"
              onClick={setModalColorVisibility({
                isOpened: true,
                index,
                fieldName: 'color',
                fieldValue: tag.color,
              })}
            >
              <span>
                <FormattedMessage id="color" />
              </span>
              <div className={styles.colorBox} style={{ backgroundColor: tag.color }} />
              <ErrorMessage
                errors={formState.errors}
                name={`tags.${index}.color`}
                render={({ message }) => <span className={styles.error}>{message}</span>}
              />
            </div>
            <div
              className={styles.column}
              role="presentation"
              onClick={setModalColorVisibility({
                isOpened: true,
                index,
                fieldName: 'fontColor',
                fieldValue: tag.fontColor,
              })}
            >
              <span>
                <FormattedMessage id="fontColor" />
              </span>
              <div className={styles.colorBox} style={{ backgroundColor: tag.fontColor }} />
              <ErrorMessage
                errors={formState.errors}
                name={`tags.${index}.fontColor`}
                render={({ message }) => <span className={styles.error}>{message}</span>}
              />
            </div>
            <Image
              alt="Img"
              src="/delete.svg"
              width={24}
              height={24}
              onClick={deleteTag(index, tag)}
            />
          </div>
        );
      })}
      <button className={styles.button} onClick={addNewTag} ref={buttonRef}>
        <span>
          <FormattedMessage id="card.addNewTag" />
        </span>
        <Image alt="Img" src="/plus.svg" width={20} height={20} priority />
      </button>
      {modalColorState.isOpened && (
        <ModalColor
          initialColor={modalColorState.fieldValue}
          closeModal={setModalColorVisibility({
            isOpened: false,
            index: undefined,
            fieldName: undefined,
            fieldValue: undefined,
          })}
          onSubmit={onChooseColor}
        />
      )}
    </div>
  );
}
