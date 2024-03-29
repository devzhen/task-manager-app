import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';

import '@/app/validators';
import { VALIDATION } from '@/app/constants';
import type { LoginInputs } from '@/app/types';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(VALIDATION.auth.minPasswordLength).required(),
    error: yup.string(),
  })
  .required();

export default yupResolver(schema) as unknown as Resolver<LoginInputs>;
