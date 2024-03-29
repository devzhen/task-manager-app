import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';
import '@/app/validators';

import { VALIDATION } from '@/app/constants';

import type { AddCardFormInputs } from './types';

const schema = yup
  .object({
    title: yup
      .string()
      .min(
        VALIDATION.card.titleMinLength,
        `The minimum length is ${VALIDATION.card.titleMinLength}`,
      )
      .required('A task title is required'),
    description: yup.string(),
  })
  .required();

export default yupResolver(schema) as unknown as Resolver<AddCardFormInputs>;
