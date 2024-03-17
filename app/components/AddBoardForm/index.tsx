'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';

import addBoard from '@/app/api/board/addBoard';
import fetchBoards from '@/app/api/board/fetchBoards';
import { ROUTES } from '@/app/constants';
import { BoardType } from '@/app/types';

import SubmitButton from '../SubmitButton';

import styles from './AddBoardForm.module.css';
import { initialFormValues } from './constants';
import { createSchema } from './schema';
import BoardStatuses from './Statuses';
import BoardTags from './Tags';
import { AddBoardFormInputs } from './types';

type AddBoardFormProps = {
  boards: BoardType[];
};

export default function AddBoardForm(props: AddBoardFormProps) {
  const { boards } = props;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Form
  const methods = useForm<AddBoardFormInputs>({
    resolver: createSchema(boards.map((item) => item.name)),
    mode: 'all',
    defaultValues: initialFormValues,
  });
  const { formState, handleSubmit, register } = methods;

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<AddBoardFormInputs> = async (data) => {
    try {
      setIsLoading(true);

      const board = await addBoard(data);

      await fetchBoards();

      router.push(ROUTES.showBoard.replace('[id]', board.id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.column}>
        <label htmlFor="board-name">Name:</label>
        <div className={styles.inputWrapper}>
          <input type="text" id="board-name" className={styles.input} {...register('name')} />
          <ErrorMessage
            errors={formState.errors}
            name="name"
            render={({ message }) => <div className={styles.error}>{message}</div>}
          />
        </div>
        <BoardStatuses name="statuses" />
        <BoardTags name="tags" />
        <div className={styles.submitSection}>
          <SubmitButton
            isLoading={isLoading}
            onClick={handleSubmit(onSubmitHandler)}
            disabled={!formState.isDirty || !formState.isValid}
          />
        </div>
      </div>
    </FormProvider>
  );
}
