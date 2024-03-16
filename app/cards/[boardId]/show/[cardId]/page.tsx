import fetchCard from '@/app/api/card/fetchCard';
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

  const card = await fetchCard(cardId);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2>Task Details</h2>
        <ButtonDeleteCard cardId={cardId} boardId={boardId} />
      </div>
    </div>
  );
}
