import ButtonAddCard from '../ButtonAddCard';

import styles from './CardsEmptyState.module.css';

type CardsEmptyStateProps = {
  addCard: () => void;
};

export default function CardsEmptyState(props: CardsEmptyStateProps) {
  const { addCard } = props;

  return (
    <div className={styles.container}>
      <h4>There are no cards for this board</h4>
      <ButtonAddCard addCard={addCard} />
    </div>
  );
}
