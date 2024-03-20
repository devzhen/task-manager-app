import { propOr } from 'ramda';
import { useController, type UseControllerProps } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';

import type { StatusType } from '@/app/types';

import type { AddCardFormInputs } from '../types';

import styles from './StatusSelect.module.css';

type StatusSelectProps = UseControllerProps<AddCardFormInputs> & {
  statuses: StatusType[];
};

export default function StatusSelect(props: StatusSelectProps) {
  const { statuses } = props;

  const { field } = useController<AddCardFormInputs, 'status'>({
    name: 'status',
    control: props.control,
  });

  return (
    <>
      <label htmlFor="card-status">
        <FormattedMessage id="status" />:
      </label>
      <Select
        options={statuses}
        id="card-status"
        classNamePrefix="card-select"
        isSearchable={false}
        components={{
          Option: ({ data, selectOption }) => {
            return (
              <div className={styles.option} onClick={() => selectOption(data)} role="presentation">
                <div className={styles.optionCircle} style={{ backgroundColor: data.color }} />
                <span>{propOr('', 'label', data)}</span>
              </div>
            );
          },
        }}
        {...field}
      />
    </>
  );
}
