'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, Controller, Resolver, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import * as yup from 'yup';

import { API_HOST, STATUSES, STATUSES_OBJ, TASK_TITLE_MIN_LENGTH } from '@/app/constants';
import { AddCardFormInputs, BoardType, StatusType } from '@/app/types';

import Attachments from '../Attachments';

import styles from './AddCardForm.module.css';

const schema = yup
  .object({
    title: yup
      .string()
      .min(TASK_TITLE_MIN_LENGTH, `The minimum length is ${TASK_TITLE_MIN_LENGTH}`)
      .required('A task title is required'),
    description: yup.string(),
  })
  .required();

type AddCardFormProps = {
  board: BoardType;
};

export default function AddCardForm(props: AddCardFormProps) {
  const { board } = props;

  const router = useRouter();

  const backlogStatusRef = useRef<StatusType | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);

  // prepare status options
  const statuses = board.statuses.map((status) => {
    const statusName = STATUSES_OBJ[status.name].name;

    const option = { ...status, value: status.id, label: statusName };

    if (status.name === STATUSES.backlog) {
      backlogStatusRef.current = option;
    }

    return option;
  });

  // prepare tags options
  const tags = board.tags.map((tag) => {
    return { ...tag, value: tag.id, label: tag.name };
  });

  // Form
  const { formState, handleSubmit, control, register, setValue, getValues } =
    useForm<AddCardFormInputs>({
      resolver: yupResolver(schema) as unknown as Resolver<AddCardFormInputs>,
      mode: 'onBlur',
      values: {
        title: '',
        description: '',
        status: backlogStatusRef.current as StatusType,
        tags: [],
        attachments: [],
      },
    });

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<AddCardFormInputs> = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('boardId', board.id);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('statusId', data.status.id);
      data.tags.forEach((tag) => {
        formData.append('tags[]', tag.id);
      });
      // Object.values(data.attachments).forEach((attachment) => {
      //   formData.append('attachments[]', attachment);
      //   formData.append('attachmentsPosition[]', `${attachment.position}`);
      // });

      const url = new URL(`${API_HOST}/api/card/add`);
      await fetch(url.toString(), {
        method: 'POST',
        body: formData,
      });
      router.back();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Lifecycle. Revoke resources.
   */
  useEffect(
    () => () => {
      const { attachments } = getValues();

      for (const src of Object.keys(attachments)) {
        URL.revokeObjectURL(src);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <div className={styles.column}>
        <label htmlFor="card-name">Title:</label>
        <div className={styles.inputWrapper}>
          <input type="text" id="card-name" className={styles.input} {...register('title')} />
          <ErrorMessage
            errors={formState.errors}
            name="title"
            render={({ message }) => <div className={styles.error}>{message}</div>}
          />
        </div>
        <label htmlFor="card-description">Description:</label>
        <div className={styles.textAreWrapper}>
          <textarea
            id="card-description"
            rows={6}
            className={styles.textarea}
            {...register('description')}
          />
        </div>
      </div>
      <div className={styles.column}>
        <label htmlFor="card-status">Status:</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => {
            return (
              <Select
                options={statuses}
                id="card-status"
                classNamePrefix="card-select"
                isSearchable={false}
                {...field}
              />
            );
          }}
        />
        <label htmlFor="card-status">Tags:</label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => {
            return (
              <Select
                options={tags}
                id="card-tags"
                classNamePrefix="card-select"
                isSearchable={false}
                isMulti
                components={{
                  MultiValue: ({ data, getValue, setValue: setMultipleValue }) => {
                    return (
                      <div className={styles.tag} style={{ backgroundColor: data.color }}>
                        <span style={{ color: data.fontColor }}>{data.name}</span>
                        <div
                          className={styles.tagClear}
                          onClick={(e) => {
                            e.stopPropagation();
                            const filtered = getValue().filter((option) => option.id !== data.id);
                            setMultipleValue(filtered, 'deselect-option');
                          }}
                          role="presentation"
                        >
                          <Image
                            src="/close.svg"
                            width={12}
                            height={12}
                            alt="Img"
                            draggable={false}
                          />
                        </div>
                      </div>
                    );
                  },
                  Option: ({ data, selectOption }) => {
                    return (
                      <div
                        className={styles.option}
                        onClick={() => selectOption(data)}
                        role="presentation"
                      >
                        <div
                          className={styles.optionCircle}
                          style={{ backgroundColor: data.color }}
                        />
                        <span>{data.label}</span>
                      </div>
                    );
                  },
                }}
                {...field}
              />
            );
          }}
        />
      </div>
      <div className={styles.row}>
        <Attachments name="attachments" control={control} setValue={setValue} />
      </div>
      <div className={styles.row}>
        <button
          className={styles.submitButton}
          onClick={handleSubmit(onSubmitHandler)}
          disabled={!formState.isDirty || !formState.isValid}
        >
          {isLoading && <div className="loader" />}
          {!isLoading && <>Submit</>}
        </button>
      </div>
    </>
  );
}
