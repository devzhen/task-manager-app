import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';
import '@/app/validators';

import { TASK_TITLE_MIN_LENGTH } from '@/app/constants';

import type { AddBoardFormInputs } from './types';

export const createSchema = (boardNames: string[]) => {
  return yupResolver(
    yup
      .object({
        name: yup
          .string()
          .restrictedValues(boardNames, 'The current name already exists')
          .min(TASK_TITLE_MIN_LENGTH, `The minimum length is ${TASK_TITLE_MIN_LENGTH}`)
          .required('A board name is required'),
        statuses: yup
          .array()
          .of(
            yup.object({
              name: yup
                .string()
                .min(TASK_TITLE_MIN_LENGTH, `must be >= ${TASK_TITLE_MIN_LENGTH}`)
                .required(),
              color: yup.string().required('required'),
            }),
          )
          .uniqueItemProperty('name', 'The status name must be unique')
          .min(1, 'The statuses are required field')
          .required(),
        tags: yup
          .array()
          .of(
            yup.object({
              name: yup
                .string()
                .min(TASK_TITLE_MIN_LENGTH, `must be >= ${TASK_TITLE_MIN_LENGTH}`)
                .required(),
              color: yup.string().required('required'),
              fontColor: yup.string().required('required'),
            }),
          )
          .uniqueItemProperty('name', 'The tag name must be unique')
          .required(),
      })
      .required(),
  ) as unknown as Resolver<AddBoardFormInputs>;
};
