'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import type { LoginInputs } from '@/app/types';

import AuthSubmitButton from '../AuthSubmitButton';

import styles from './LoginForm.module.css';
import resolver from './schema';

type LoginFormProps = {
  login: (state: LoginInputs) => Promise<LoginInputs>;
};

export default function LoginForm(props: LoginFormProps) {
  const { login } = props;

  const { register, formState } = useForm<LoginInputs>({
    resolver,
    mode: 'all',
    defaultValues: {
      email: 'admin@test.com',
      password: 'testtest',
    },
  });

  const [state, formAction] = useFormState<LoginInputs>(
    login,
    formState.defaultValues as LoginInputs,
  );

  console.log({ state });

  return (
    <form className={styles.form} method="POST" action={formAction}>
      <h3>
        <FormattedMessage id="auth.login" />
      </h3>
      <p>
        <FormattedMessage id="auth.email" />
      </p>
      <input id="email" type="text" {...register('email', { required: true })} />
      <ErrorMessage
        errors={formState.errors}
        name="email"
        render={({ message }) => <span className={styles.error}>{message}</span>}
      />
      <p className={styles.password}>
        <FormattedMessage id="auth.password" />
      </p>
      <input id="password" type="password" {...register('password', { required: true })} />
      <ErrorMessage
        errors={formState.errors}
        name="password"
        render={({ message }) => <span className={styles.error}>{message}</span>}
      />
      <AuthSubmitButton disabled={!formState.isValid} />
    </form>
  );
}
