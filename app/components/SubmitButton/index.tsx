import styles from './SubmitButton.module.css';

type SubmitButtonProps = {
  text?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function SubmitButton(props: SubmitButtonProps) {
  const { onClick, disabled, isLoading, text = 'Submit' } = props;

  return (
    <button className={styles.container} onClick={onClick} disabled={disabled}>
      {isLoading && <div className="loader" />}
      {!isLoading && <span>{text}</span>}
    </button>
  );
}
