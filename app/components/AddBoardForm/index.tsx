'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

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

  // const schema = yup
  //   .object({
  //     boardId: yup.string().nullable(),
  //     name: yup
  //       .string()
  //       .min(TASK_TITLE_MIN_LENGTH, `The minimum length is ${TASK_TITLE_MIN_LENGTH}`)
  //       .required('A board name is required')
  //       .restrictedValues(
  //         boards.filter((item) => item.name !== board?.name).map((item) => item.name),
  //         'The current name already exists',
  //       ),
  //     statuses: yup
  //       .array()
  //       .of(
  //         yup.object({
  //           name: yup
  //             .string()
  //             .min(TASK_TITLE_MIN_LENGTH, `must be >= ${TASK_TITLE_MIN_LENGTH}`)
  //             .required(),
  //           color: yup.string().required('required'),
  //         }),
  //       )
  //       .uniqueItemProperty('name', 'The status name must be unique')
  //       .min(1, 'The statuses are required field')
  //       .required(),
  //     tags: yup
  //       .array()
  //       .of(
  //         yup.object({
  //           name: yup
  //             .string()
  //             .min(TASK_TITLE_MIN_LENGTH, `must be >= ${TASK_TITLE_MIN_LENGTH}`)
  //             .required(),
  //           color: yup.string().required('required'),
  //           fontColor: yup.string().required('required'),
  //         }),
  //       )
  //       .uniqueItemProperty('name', 'The tag name must be unique'),
  //     deletedStatuses: yup.array().of(
  //       yup.object({
  //         id: yup.string(),
  //       }),
  //     ),
  //     deletedTags: yup.array().of(
  //       yup.object({
  //         id: yup.string(),
  //       }),
  //     ),
  //   })
  //   .required();

  // schema
  //   .validate(getValues())
  //   .then((values) => {
  //     console.log('then', values);
  //   })
  //   .catch((error) => {
  //     console.log('catch', error);
  //   });

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<AddBoardFormInputs> = async (data) => {
    try {
      setIsLoading(true);

      const method = board ? updateBoard : addBoard;

      const addedBoard = await method(data);

      router.push(ROUTES.showBoard.replace('[boardId]', addedBoard.id));
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
