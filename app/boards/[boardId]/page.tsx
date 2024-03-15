import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCards from '@/app/api/card/fetchCards';
import Statuses from '@/app/components/Statuses';
import type { StatusesCardType } from '@/app/types';

type BoardPageProps = {
  params: {
    boardId: string;
  };
};

export default async function BoardPage(props: BoardPageProps) {
  const { boardId } = props.params;

  const data = await fetchCards(boardId);

  const [cardsObj, board] = await Promise.all([fetchCards(boardId), fetchBoard(boardId)]);

  if (data === null) {
    notFound();
  }

  const { cards, total } = cardsObj as {
    cards: StatusesCardType;
    total: number;
  };

  return (
    <div className="cards-wrapper">
      <Statuses initialCards={cards} total={total} board={board} />
    </div>
  );
}
