import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';
import '@/app/validators';

import { TASK_TITLE_MIN_LENGTH } from '@/app/constants';

import type { AddCardFormInputs } from './types';

const schema = yup
  .object({
    title: yup
      .string()
      .min(TASK_TITLE_MIN_LENGTH, `The minimum length is ${TASK_TITLE_MIN_LENGTH}`)
      .required('A task title is required'),
    description: yup.string(),
  })
  .required();

export default yupResolver(schema) as unknown as Resolver<AddCardFormInputs>;
