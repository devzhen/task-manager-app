import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { path } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from 'react-modal';
import Sortable from 'sortablejs';
import { v4 as uuid } from 'uuid';

import ModalColor from '@/app/components/ModalColor';
import usePrevious from '@/app/hooks/usePrevious';
import type { BoardMetaType, BoardType } from '@/app/types';

import ModalInfo from '../../ModalInfo';
import type { AddBoardFormInputs } from '../types';

import styles from './Statuses.module.css';

type StatusesProps = {
  name: string;
  board?: BoardType | undefined;
  boardMeta?: BoardMetaType | undefined;
};

export default function Statuses(props: StatusesProps) {
  const { name, board, boardMeta } = props;

  const { formatMessage } = useIntl();

  const statusesContainerRef = useRef<HTMLDivElement | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { register, trigger, getValues, formState, setValue } = useFormContext();

  const [modalColorState, setModalColorState] = useState<{
    isOpened: boolean;
    index: number | undefined;
    color: string | undefined;
  }>({
    isOpened: false,
    index: undefined,
    color: undefined,
  });

  const [modalInfoState, setModalInfoState] = useState<{
    isOpened: boolean;
    title: string;
    description: string;
  }>({
    isOpened: false,
    title: 'Error',
    description: '',
  });

  const { fields, append, update, remove } = useFieldArray<
    AddBoardFormInputs,
    'statuses',
    'formFieldId'
  >({
    name: 'statuses',
    keyName: 'formFieldId',
  });
  const fieldsLengthPrev = usePrevious(fields.length);

  const { append: appendDeletedStatuses } = useFieldArray<
    AddBoardFormInputs,
    'deletedStatuses',
    'formFieldId'
  >({
    name: 'deletedStatuses',
    keyName: 'formFieldId',
  });

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
   * Set a modal visibility
   */
  const setModalInfoVisibility = (isOpened: boolean) => () => {
    setModalInfoState((prev) => ({
      ...prev,
      isOpened,
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
  const deleteStatus = (index: number, status: AddBoardFormInputs['statuses']['0']) => () => {
    if (board && boardMeta) {
      const countCards = path(['statuses', status.name], boardMeta);

      if (countCards && countCards !== 0) {
        setModalInfoState((prev) => ({
          ...prev,
          isOpened: true,
          description: formatMessage(
            { id: 'board.cantDeleteStatus' },
            {
              statusName: status.name,
              countCards,
            },
          ),
        }));

        return;
      }

      if (!status.isNew) {
        appendDeletedStatuses({ id: status.id });
      }
    }

    remove(index);
    trigger(name);
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    Modal.setAppElement('.container');

    Sortable.create(statusesContainerRef.current as HTMLDivElement, {
      handle: '.handle',
      onChange: () => {
        const elements = statusesContainerRef.current?.querySelectorAll('[data-role="status"]');
        if (elements) {
          const newStatuses = [...getValues().statuses];

          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const id = element.getAttribute('data-id');

            const index = newStatuses.findIndex((item) => item.id === id);
            if (index !== -1) {
              newStatuses[index].position = i + 1;
            }
          }

          setValue(
            'statuses',
            newStatuses.sort((a, b) => a.position - b.position),
          );
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <p>
        <FormattedMessage id="statuses" />:
      </p>
      <div className={styles.errorWrapper}>
        <ErrorMessage
          errors={formState.errors}
          name={'statuses'}
          render={({ message }) => <span className={styles.error}>{message}</span>}
        />
      </div>
      <div className={styles.statusesWrapper} ref={statusesContainerRef}>
        {fields.map((status, index) => {
          return (
            <div
              className={styles.statusRow}
              key={status.id}
              data-id={status.id}
              data-position={status.position}
              data-index={index}
              data-is-new={status.isNew}
              data-role="status"
            >
              <div className={styles.column}>
                <span>
                  <FormattedMessage id="name" />
                </span>
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
                <span>
                  <FormattedMessage id="color" />
                </span>
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
                onClick={deleteStatus(index, status)}
              />
              {!path(['errors', 'statuses', index], formState) && (
                <Image
                  alt="Img"
                  src="/drag-cursor.svg"
                  width={24}
                  height={24}
                  className="handle"
                  data-role="handle"
                />
              )}
            </div>
          );
        })}
      </div>
      <button className={styles.button} onClick={addNewStatus} ref={buttonRef}>
        <span>
          <FormattedMessage id="card.addNewStatus" />
        </span>
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
      {modalInfoState.isOpened && (
        <ModalInfo
          closeModal={setModalInfoVisibility(false)}
          title={modalInfoState.title}
          description={modalInfoState.description}
        />
      )}
    </div>
  );
}
