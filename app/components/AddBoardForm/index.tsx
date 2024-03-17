'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Resolver, SubmitHandler, FormProvider } from 'react-hook-form';

import styles from './AddBoardForm.module.css';
import { initialFormValues } from './constants';
import { schema } from './schema';
import BoardStatuses from './Statuses';
import BoardTags from './Tags';
import { AddBoardFormInputs } from './types';

export default function AddBoardForm() {
  // Form
  const methods = useForm<AddBoardFormInputs>({
    resolver: yupResolver(schema) as unknown as Resolver<AddBoardFormInputs>,
    mode: 'all',
    defaultValues: initialFormValues,
  });
  const { formState, handleSubmit, register } = methods;

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<AddBoardFormInputs> = async (data) => {
    try {
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } finally {
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
      </div>
    </FormProvider>
  );
}
