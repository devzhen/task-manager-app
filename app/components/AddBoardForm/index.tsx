'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import addBoard from '@/app/api/board/addBoard';
import updateBoard from '@/app/api/board/updateBoard';
import { ROUTES } from '@/app/constants';
import type { BoardType, BoardMetaType } from '@/app/types';

import SubmitButton from '../SubmitButton';

import styles from './AddBoardForm.module.css';
import { createInitialValues } from './constants';
import { createSchema } from './schema';
import BoardStatuses from './Statuses';
import BoardTags from './Tags';
import type { AddBoardFormInputs } from './types';

type AddBoardFormProps = {
  boards: { id: string; name: string }[];
  board?: BoardType | undefined;
  boardMeta?: BoardMetaType | undefined;
};

export default function AddBoardForm(props: AddBoardFormProps) {
  const { boards, board, boardMeta } = props;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Form
  const methods = useForm<AddBoardFormInputs>({
    resolver: createSchema(
      board,
      boards.map((item) => item.name),
    ),
    mode: 'all',
    defaultValues: createInitialValues(board),
  });
  const { formState, handleSubmit, register } = methods;

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<AddBoardFormInputs> = async (data) => {
    try {
      setIsLoading(true);

      for (let i = 0; i < data.statuses.length; i++) {
        const status = data.statuses[i];
        status.position = i + 1;
      }

      const method = board ? updateBoard : addBoard;

      const newBoard = await method(data);

      router.push(ROUTES.showBoard.replace('[boardId]', newBoard.id));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = board ? formState.isValid : formState.isDirty && formState.isValid;

  return (
    <FormProvider {...methods}>
      <h2 className={styles.header}>
        {board ? <FormattedMessage id="board.edit" /> : <FormattedMessage id="board.addNew" />}
      </h2>
      <div className={styles.column}>
        <label htmlFor="board-name">
          <FormattedMessage id="name" />:
        </label>
        <div className={styles.inputWrapper}>
          <input type="text" id="board-name" className={styles.input} {...register('name')} />
          <ErrorMessage
            errors={formState.errors}
            name="name"
            render={({ message }) => <div className={styles.error}>{message}</div>}
          />
        </div>
        <BoardStatuses name="statuses" board={board} boardMeta={boardMeta} />
        <BoardTags name="tags" board={board} />
        <div className={styles.submitSection}>
          <SubmitButton
            isLoading={isLoading}
            onClick={handleSubmit(onSubmitHandler)}
            disabled={!isValid}
          />
        </div>
      </div>
    </FormProvider>
  );
}
