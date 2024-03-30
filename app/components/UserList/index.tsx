'use client';

import { ErrorMessage } from '@hookform/error-message';
import Image from 'next/image';
import { append, clone, compose, prop, remove } from 'ramda';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import Select from 'react-select';
import { v4 as uuid } from 'uuid';

import { USER_ROLE } from '@/app/constants';
import type { UserType } from '@/app/types';

import SubmitButton from '../SubmitButton';

import resolver from './schema';
import type { UserInputs } from './types';
import styles from './UserList.module.css';

type UserListProps = {
  users: UserType[];
};

export default function UserList(props: UserListProps) {
  const { users } = props;

  const { formatMessage } = useIntl();

  const methods = useForm<UserInputs>({
    mode: 'all',
    resolver,
    defaultValues: {
      users: users.map((item) => ({ ...item, isNew: false })),
    },
  });
  const { getValues, register, formState, setValue, control, trigger, handleSubmit } = methods;

  const roles = Object.values(USER_ROLE).map((role) => {
    const option = { value: role, label: formatMessage({ id: role }) };

    return option;
  });

  /**
   * Add a new user
   */
  const addNewUser = () => {
    const user = { id: uuid(), email: '', role: '', isNew: true };

    const newUsers = compose(append(user), prop('users'))(getValues());

    setValue('users', newUsers);

    trigger();
  };

  /**
   * Delete a user
   */
  const deleteUser = (user: UserInputs['users'][0], index: number) => () => {
    let newUsers = clone(getValues().users);

    if (user.isNew) {
      newUsers = remove(index, 1, newUsers);
    } else {
      newUsers[index].isDeleted = true;
    }

    setValue('users', newUsers);

    trigger();
  };

  /**
   * Submit handler
   */
  const onSubmitHandler: SubmitHandler<UserInputs> = async (data) => {
    try {
      // eslint-disable-next-line no-console
      console.log(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage id="users" />
      </h2>
      <FormProvider {...methods}>
        {getValues()
          .users.filter((user) => user.isDeleted !== true)
          .map((user, index) => {
            return (
              <div className={styles.userRow} key={user.id}>
                <div className={styles.column}>
                  <span>
                    <FormattedMessage id="auth.email" />:
                  </span>
                  <input
                    type="text"
                    className={styles.emailInput}
                    {...register(`users.${index}.email` as const)}
                  />
                  <ErrorMessage
                    errors={formState.errors}
                    name={`users.${index}.email`}
                    render={({ message }) => (
                      <span className={styles.error}>
                        <FormattedMessage id={message} />
                      </span>
                    )}
                  />
                </div>
                <div className={styles.column}>
                  <span>
                    <FormattedMessage id="role" />:
                  </span>
                  <div className={styles.selectWrapper}>
                    <Controller
                      name="users"
                      control={control}
                      render={({ field }) => {
                        const currentUser = field.value[index];

                        const roleValue = currentUser?.role
                          ? {
                              label: formatMessage({ id: currentUser.role }),
                              value: currentUser.role,
                            }
                          : undefined;

                        return (
                          <Select
                            options={roles}
                            id="user-role"
                            classNamePrefix="card-select"
                            isSearchable={false}
                            onChange={(newValue) => {
                              const newUsers = clone(getValues().users);
                              newUsers[index].role = newValue?.value as string;
                              newUsers[index].isUpdated = true;

                              setValue(`users.${index}.role`, newValue?.value as string, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                            }}
                            value={roleValue}
                          />
                        );
                      }}
                    />
                  </div>
                  <ErrorMessage
                    errors={formState.errors}
                    name={`users.${index}.role`}
                    render={({ message }) => (
                      <span className={styles.error}>
                        <FormattedMessage id={message} />
                      </span>
                    )}
                  />
                </div>
                <Image
                  alt="Img"
                  src="/delete.svg"
                  width={24}
                  height={24}
                  onClick={deleteUser(user, index)}
                />
              </div>
            );
          })}
        <button className={styles.button} onClick={addNewUser} disabled={!formState.isValid}>
          <span>
            <FormattedMessage id="user.addNew" />
          </span>
          <Image alt="Img" src="/plus.svg" width={20} height={20} priority />
        </button>
        <div className={styles.submit}>
          <SubmitButton
            isLoading={formState.isSubmitting}
            onClick={handleSubmit(onSubmitHandler)}
            disabled={!formState.isDirty || !formState.isValid}
          />
        </div>
      </FormProvider>
    </div>
  );
}
