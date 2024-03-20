import { notFound } from 'next/navigation';
import { any, equals, isNil } from 'ramda';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCard from '@/app/api/card/fetchCard';
import AddCardForm from '@/app/components/AddCardForm';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import CardHeader from '@/app/components/CardHeader';
import { getDictionary } from '@/app/dictionaries';

import styles from './page.module.css';

type ShowPageProps = {
  params: {
    cardId: string;
    boardId: string;
    lang: string;
  };
};

export default async function ShowPage(props: ShowPageProps) {
  const {
    params: { cardId, boardId, lang },
  } = props;

  const [card, board, dictionary] = await Promise.all([
    fetchCard(cardId),
    fetchBoard(boardId),
    getDictionary(lang),
  ]);

  const condition = any(equals(true))([
    isNil(card),
    isNil(board),
    card && 'error' in card,
    board && 'error' in board,
  ]);

  if (condition) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppIntlProvider dictionary={dictionary} locale={lang}>
          <CardHeader cardId={cardId} boardId={boardId} />
          <AddCardForm board={board} card={card} />
        </AppIntlProvider>
      </div>
    </div>
  );
}
