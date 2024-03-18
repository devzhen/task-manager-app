import { yupResolver } from '@hookform/resolvers/yup';
import type { Resolver } from 'react-hook-form';
import * as yup from 'yup';
import '@/app/validators';

import { TASK_TITLE_MIN_LENGTH } from '@/app/constants';
import type { BoardType } from '@/app/types';

import type { AddBoardFormInputs } from './types';

export const createSchema = (board: BoardType | undefined, boardNames: string[]) => {
  let names = [...boardNames];

  if (board) {
    names = names.filter((name) => name !== board.name);
  }

  return yupResolver(
    yup
      .object({
        boardId: yup.string().nullable(),
        name: yup
          .string()
          .min(TASK_TITLE_MIN_LENGTH, `The minimum length is ${TASK_TITLE_MIN_LENGTH}`)
          .required('A board name is required')
          .restrictedValues(names, 'The current name already exists'),
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
          .uniqueItemProperty('name', 'The tag name must be unique'),
        deletedStatuses: yup.array().of(
          yup.object({
            id: yup.string(),
          }),
        ),
        deletedTags: yup.array().of(
          yup.object({
            id: yup.string(),
          }),
        ),
      })
      .required(),
  ) as unknown as Resolver<AddBoardFormInputs>;
};
