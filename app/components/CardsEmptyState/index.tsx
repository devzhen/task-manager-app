import { FormattedMessage } from 'react-intl';

import ButtonAddCard from '../ButtonAddCard';

import styles from './CardsEmptyState.module.css';

type CardsEmptyStateProps = {
  boardId: string;
};

export default function CardsEmptyState(props: CardsEmptyStateProps) {
  const { boardId } = props;

  return (
    <div className={styles.container}>
      <h4>
        <FormattedMessage id="board.noCards" />
      </h4>
      <ButtonAddCard boardId={boardId} />
    </div>
  );
}
