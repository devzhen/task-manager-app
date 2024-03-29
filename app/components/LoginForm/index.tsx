'use client';

import { ErrorMessage } from '@hookform/error-message';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

import type { LoginInputs } from '@/app/types';

import styles from './LoginForm.module.css';
import resolver from './schema';

type LoginFormProps = {
  login: (data: LoginInputs) => Promise<Record<string, string | number | boolean>>;
};

export default function LoginForm(props: LoginFormProps) {
  const { login } = props;

  const { formatMessage } = useIntl();

  const { register, formState, handleSubmit, resetField, setError } = useForm<LoginInputs>({
    resolver,
    mode: 'all',
    defaultValues: {
      email: 'admin@test.com',
      password: 'testtest',
      error: '',
    },
  });

  const onSubmitHandler: SubmitHandler<LoginInputs> = async (data) => {
    resetField('error');

    const result = await login(data);

    if (result && 'statusCode' in result && result.statusCode === 403) {
      setError('error', { message: formatMessage({ id: 'auth.incorrectPassword' }) });
    }

    if (result && 'statusCode' in result && result.statusCode === 404) {
      setError('error', {
        message: formatMessage({ id: 'auth.incorrectEmail' }, { email: data.email }),
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
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
      <ErrorMessage
        errors={formState.errors}
        name="error"
        render={({ message }) => <span className={styles.submitError}>{message}</span>}
      />
      <button type="submit" disabled={!formState.isValid || formState.isSubmitting}>
        {formState.isSubmitting && <div className="loader" />}
        {!formState.isSubmitting && <FormattedMessage id="auth.login" />}
      </button>
    </form>
  );
}
