import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCards from '@/app/api/card/fetchCards';
import CardsWrapper from '@/app/components/CardsWrapper';
import Statuses from '@/app/components/Statuses';
import type { CardType } from '@/app/types';

type BoardPageProps = {
  params: {
    boardId: string;
    lang: string;
  };
};

export default async function BoardPage(props: BoardPageProps) {
  const { boardId } = props.params;

  const [cardsObj, board] = await Promise.all([fetchCards(boardId), fetchBoard(boardId)]);

  if (cardsObj === null) {
    notFound();
  }

  const { cards, total } = cardsObj as {
    cards: Record<string, CardType[]>;
    total: number;
  };

  return (
    <CardsWrapper>
      <Statuses initialCards={cards} total={total} board={board} />
    </CardsWrapper>
  );
}
