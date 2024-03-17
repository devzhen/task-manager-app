import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, useFormContext } from 'react-hook-form';
import Modal from 'react-modal';
import { v4 as uuid } from 'uuid';

import ModalColor from '@/app/components/ModalColor';

import { AddBoardFormInputs } from '../types';

import styles from './Tags.module.css';

type TagsProps = {
  name: string;
};

export default function Tags(props: TagsProps) {
  const { name } = props;

  const { register, trigger, getValues, formState, control } = useFormContext();

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

  const { fields, append, update, remove } = useFieldArray<AddBoardFormInputs, 'tags'>({
    control: control as unknown as Control<AddBoardFormInputs>,
    name: 'tags',
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
  const deleteTag = (index: number) => () => {
    remove(index);
    trigger(name);
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

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
              <span>Name</span>
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
              <span>Color</span>
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
              <span>Font Color</span>
              <div className={styles.colorBox} style={{ backgroundColor: tag.fontColor }} />
              <ErrorMessage
                errors={formState.errors}
                name={`tags.${index}.fontColor`}
                render={({ message }) => <span className={styles.error}>{message}</span>}
              />
            </div>
            <Image alt="Img" src="/delete.svg" width={24} height={24} onClick={deleteTag(index)} />
          </div>
        );
      })}
      <button className={styles.button} onClick={addNewTag}>
        <span>Add a new tag</span>
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
