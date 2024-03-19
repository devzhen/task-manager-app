import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCard from '@/app/api/card/fetchCard';
import AddCardForm from '@/app/components/AddCardForm';
import ButtonDeleteCard from '@/app/components/ButtonDeleteCard';

import styles from './page.module.css';

type ShowPageProps = {
  params: {
    cardId: string;
    boardId: string;
  };
};

export default async function ShowPage(props: ShowPageProps) {
  const {
    params: { cardId, boardId },
  } = props;

  const [card, board] = await Promise.all([fetchCard(cardId), fetchBoard(boardId)]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Task Details</h2>
          {card?.id && <ButtonDeleteCard cardId={cardId} boardId={boardId} />}
        </div>
        <AddCardForm board={board} card={card} />
      </div>
    </div>
  );
}
