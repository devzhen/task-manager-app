import { useFormStatus } from 'react-dom';
import { FormattedMessage } from 'react-intl';

type SubmitButtonProps = {
  disabled: boolean;
  text?: string;
};

const SubmitButton = ({ disabled, text = 'auth.login' }: SubmitButtonProps) => {
  const status = useFormStatus();

  return (
    <button type="submit" disabled={disabled || status.pending}>
      {status.pending && <div className="loader" />}
      {!status.pending && <FormattedMessage id={text} />}
    </button>
  );
};

export default SubmitButton;
