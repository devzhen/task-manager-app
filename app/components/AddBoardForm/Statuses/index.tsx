import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Control, useFieldArray, useFormContext } from 'react-hook-form';
import Modal from 'react-modal';
import { v4 as uuid } from 'uuid';

import ModalColor from '@/app/components/ModalColor';
import usePrevious from '@/app/hooks/usePrevious';

import { AddBoardFormInputs } from '../types';

import styles from './Statuses.module.css';

type StatusesProps = {
  name: string;
};

export default function Statuses(props: StatusesProps) {
  const { name } = props;

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { register, trigger, getValues, formState, control } = useFormContext();

  const [modalColorState, setModalColorState] = useState<{
    isOpened: boolean;
    index: number | undefined;
    color: string | undefined;
  }>({
    isOpened: false,
    index: undefined,
    color: undefined,
  });

  const { fields, append, update, remove } = useFieldArray<AddBoardFormInputs, 'statuses'>({
    control: control as unknown as Control<AddBoardFormInputs>,
    name: 'statuses',
  });
  const fieldsLengthPrev = usePrevious(fields.length);

  /**
   * Add a new status
   */
  const addNewStatus = () => {
    const existed = getValues().statuses;

    append({
      id: uuid(),
      name: '',
      color: undefined,
      isNew: true,
      position: existed.length,
    });

    trigger();
  };

  /**
   * Set a modal visibility
   */
  const setModalColorVisibility =
    ({
      isOpened,
      index,
      color,
    }: {
      isOpened: boolean;
      index: number | undefined;
      color: string | undefined;
    }) =>
    () => {
      setModalColorState((prev) => ({
        ...prev,
        isOpened,
        index,
        color,
      }));
    };

  /**
   * Choose a color
   */
  const onChooseColor = (hex: string) => {
    if (modalColorState.index !== undefined) {
      const item = getValues().statuses[modalColorState.index];
      item.color = hex;

      update(modalColorState.index, item);
      trigger(name);

      setModalColorState({
        isOpened: false,
        index: undefined,
        color: undefined,
      });
    }
  };

  /**
   * Delete a status
   */
  const deleteStatus = (index: number) => () => {
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
      <p>Statuses:</p>
      <div className={styles.errorWrapper}>
        <ErrorMessage
          errors={formState.errors}
          name={'statuses'}
          render={({ message }) => <span className={styles.error}>{message}</span>}
        />
      </div>
      {fields.map((status, index) => {
        return (
          <div className={styles.statusRow} key={status.id}>
            <div className={styles.column}>
              <span>Name</span>
              <input
                type="text"
                readOnly={status.isNew !== true}
                {...register(`statuses.${index}.name` as const)}
              />
              <ErrorMessage
                errors={formState.errors}
                name={`statuses.${index}.name`}
                render={({ message }) => <span className={styles.error}>{message}</span>}
              />
            </div>
            <div
              className={styles.column}
              role="presentation"
              onClick={setModalColorVisibility({ isOpened: true, index, color: status.color })}
            >
              <span>Color</span>
              <div className={styles.colorBox} style={{ backgroundColor: status.color }} />
              <ErrorMessage
                errors={formState.errors}
                name={`statuses.${index}.color`}
                render={({ message }) => <span className={styles.error}>{message}</span>}
              />
            </div>
            <Image
              alt="Img"
              src="/delete.svg"
              width={24}
              height={24}
              onClick={deleteStatus(index)}
            />
          </div>
        );
      })}
      <button className={styles.button} onClick={addNewStatus} ref={buttonRef}>
        <span>Add a new status</span>
        <Image alt="Img" src="/plus.svg" width={20} height={20} priority />
      </button>
      {modalColorState.isOpened && (
        <ModalColor
          initialColor={modalColorState.color}
          closeModal={setModalColorVisibility({
            isOpened: false,
            index: undefined,
            color: undefined,
          })}
          onSubmit={onChooseColor}
        />
      )}
    </div>
  );
}
