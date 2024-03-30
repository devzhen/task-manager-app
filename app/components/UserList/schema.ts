import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';

import '@/app/validators';
import type { UserInputs } from './types';

const schema = yupResolver(
  yup
    .object({
      users: yup
        .array()
        .of(
          yup.object({
            email: yup.string().email('validation.email').required('validation.required'),
            role: yup.string().required('validation.required'),
          }),
        )
        .uniqueItemProperty('email', 'validation.emailUnique'),
    })
    .required(),
) as unknown as Resolver<UserInputs>;

export default schema;
