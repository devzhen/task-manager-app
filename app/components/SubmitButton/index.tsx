import { useIntl } from 'react-intl';

import styles from './SubmitButton.module.css';

type SubmitButtonProps = {
  text?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function SubmitButton(props: SubmitButtonProps) {
  const { formatMessage } = useIntl();

  const { onClick, disabled, isLoading, text = formatMessage({ id: 'submit' }) } = props;

  return (
    <button className={styles.container} onClick={onClick} disabled={disabled}>
      {isLoading && <div className="loader" />}
      {!isLoading && <span>{text}</span>}
    </button>
  );
}
