'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useForm, Controller, Resolver, SubmitHandler } from 'react-hook-form';
import Modal from 'react-modal';
import Select from 'react-select';
import * as yup from 'yup';

import {
  API_HOST,
  STATUSES,
  STATUSES_OBJ,
  TASK_ATTACHMENT_MAX_SIZE,
  TASK_TITLE_MIN_LENGTH,
} from '@/app/constants';
import { BoardType, StatusType, TagType } from '@/app/types';

import Attachments from '../Attachments';
import ModalInfo from '../ModalInfo';

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

type FormFileType = File & {
  src: string;
  position: number;
};

type FormInputs = {
  title: string;
  description: string;
  status: StatusType;
  tags: (TagType & { label: string })[];
  attachments: Record<string, FormFileType>;
};

export default function AddCardForm(props: AddCardFormProps) {
  const { board } = props;

  const router = useRouter();

  const backlogStatusRef = useRef<StatusType | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: 'Error',
    description: '',
  });

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

  /**
   * Set modal visibility
   */
  const setModalAddVisibility = (isVisible: boolean) => () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: isVisible,
    }));
  };

  // Form
  const { formState, handleSubmit, control, register, setValue, getValues } = useForm<FormInputs>({
    resolver: yupResolver(schema) as unknown as Resolver<FormInputs>,
    mode: 'onBlur',
    values: {
      title: '',
      description: '',
      status: backlogStatusRef.current as StatusType,
      tags: [],
      attachments: {},
    },
  });

  /**
   * On drop handler
   */
  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        description: `${fileRejections.length > 1 ? `${fileRejections.length} files` : 'The file'} failed to upload due to format or size restrictions.`,
      }));
    }

    const files = acceptedFiles as FormFileType[];

    const attachments = { ...getValues().attachments };

    for (const file of files) {
      const src = URL.createObjectURL(file);
      file.src = src;
      file.position = Object.keys(attachments).length;
      attachments[src] = file;
    }

    setValue('attachments', attachments);
  };

  /**
   * On a attachment delete
   */
  const onDelete = (src: string) => () => {
    const attachments = { ...getValues().attachments };
    delete attachments[src];

    URL.revokeObjectURL(src);

    setValue('attachments', attachments);
  };

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: TASK_ATTACHMENT_MAX_SIZE,
  });

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<FormInputs> = async (data) => {
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
      Object.values(data.attachments).forEach((attachment) => {
        formData.append('attachments[]', attachment);
        formData.append('attachmentsPosition[]', `${attachment.position}`);
      });

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

  /**
   * Lifecycle
   */
  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

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
        <div className={styles.attachmentsText}>
          <p>Attachments:</p>
          <p>
            Only PNG and JPG image formats are permitted, and file sizes must not exceed 4.5 MB.
          </p>
        </div>
        <div className={styles.attachments}>
          <div {...getRootProps({ className: styles.dropZone })}>
            <input {...getInputProps()} />
            <span>{`Drag 'n' drop some files here, or click to select files`}</span>
          </div>
          <Controller
            render={({ field }) => {
              return <Attachments files={Object.values(field.value)} onDelete={onDelete} />;
            }}
            name="attachments"
            control={control}
          />
        </div>
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
      {modalState.isOpen && (
        <ModalInfo
          isOpen={modalState.isOpen}
          closeModal={setModalAddVisibility(false)}
          title={modalState.title}
          description={modalState.description}
        />
      )}
    </>
  );
}
