import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';

import '@/app/validators';
import type { LoginInputs } from '@/app/types';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export default yupResolver(schema) as unknown as Resolver<LoginInputs>;
