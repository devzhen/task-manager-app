'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';
import { compose, indexBy, pathOr } from 'ramda';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import addCard from '@/app/api/card/addCard';
import updateCard from '@/app/api/card/updateCard';
import type { BoardType, CardType } from '@/app/types';

import SubmitButton from '../SubmitButton';

import styles from './AddCardForm.module.css';
import Attachments from './Attachments';
import { createInitialFormValues } from './constants';
import resolver from './schema';
import StatusSelect from './StatusSelect';
import TagsSelect from './TagsSelect';
import type { AddCardFormInputs } from './types';

type AddCardFormProps = {
  board: BoardType;
  card?: CardType | undefined;
};

export default function AddCardForm(props: AddCardFormProps) {
  const { board, card } = props;

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // prepare status options
  const statuses = board.statuses.map((status) => {
    const option = { ...status, value: status.id, label: status.name };

    return option;
  });

  // prepare tags options
  const tags = board.tags.map((tag) => {
    return { ...tag, value: tag.id, label: tag.name };
  });

  // Form
  const methods = useForm<AddCardFormInputs>({
    resolver,
    mode: 'onBlur',
    values: createInitialFormValues({ board, card }),
  });

  const { formState, handleSubmit, register, getValues } = methods;

  /**
   * Create POST body
   */
  const createAddFormData = (data: AddCardFormInputs) => {
    const formData = new FormData();
    formData.append('boardId', board.id);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('statusId', data.status.id);
    data.tags.forEach((tag) => {
      formData.append('tags[]', tag.id);
    });
    data.attachments.forEach((attachment) => {
      formData.append('attachments[]', attachment.file as File);
      formData.append('attachmentsPosition[]', `${attachment.position}`);
    });

    return formData;
  };

  /**
   * Create PUT body
   */
  const createUpdateFormData = (data: AddCardFormInputs) => {
    const formData = new FormData();
    formData.append('id', `${card?.id}`);
    formData.append('boardId', board.id);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('statusId', data.status.id);

    // Update tags
    if (formState.dirtyFields.tags) {
      const prevTags = compose(
        indexBy((item) => (item as AddCardFormInputs['tags']['0']).id),
        pathOr([], ['defaultValues', 'tags']),
      )(formState);

      const currentTags = compose(
        indexBy((item) => (item as AddCardFormInputs['tags']['0']).id),
        pathOr([], ['tags']),
      )(data);

      for (const prevTagId of Object.keys(prevTags)) {
        if (!currentTags[prevTagId]) {
          formData.append('deletedTags[]', prevTagId);
        }
      }

      // Update tags
      data.tags.forEach((tag) => {
        formData.append('tags[]', tag.id);
      });
    }

    // Update attachments
    if (formState.dirtyFields.attachments) {
      const prevAttachments = compose(
        indexBy((item) => (item as AddCardFormInputs['attachments']['0']).id),
        pathOr([], ['defaultValues', 'attachments']),
      )(formState);

      const currentAttachments = compose(
        indexBy((item) => (item as AddCardFormInputs['attachments']['0']).id),
        pathOr([], ['attachments']),
      )(data);

      for (const prevAttachmentId of Object.keys(prevAttachments)) {
        if (!currentAttachments[prevAttachmentId]) {
          formData.append('deletedAttachments[]', prevAttachmentId);
        }
      }
      data.attachments.forEach((attachment) => {
        if (attachment.file) {
          formData.append('attachments[]', attachment.file as File);
          formData.append('attachmentsPosition[]', `${attachment.position}`);
        }
      });
    }

    return formData;
  };

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<AddCardFormInputs> = async (data) => {
    try {
      setIsLoading(true);

      const formData = card ? createUpdateFormData(data) : createAddFormData(data);

      const method = card ? updateCard : addCard;

      await method(formData);

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

      for (const attachment of attachments) {
        if (attachment.file) {
          URL.revokeObjectURL(attachment.url);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <FormProvider {...methods}>
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
        <StatusSelect name="status" statuses={statuses} />
        <TagsSelect name="tags" tags={tags} />
      </div>
      <div className={styles.row}>
        <Attachments />
      </div>
      <div className={styles.row}>
        <SubmitButton
          isLoading={isLoading}
          onClick={handleSubmit(onSubmitHandler)}
          disabled={!formState.isDirty || !formState.isValid}
        />
      </div>
    </FormProvider>
  );
}
