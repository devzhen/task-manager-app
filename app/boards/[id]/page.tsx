import { notFound } from 'next/navigation';

import fetchCards from '@/app/api/card/fetchCards';
import Statuses from '@/app/components/Statuses';
import type { StatusesCardType } from '@/app/types';

type BoardPageProps = {
  params: {
    id: string;
  };
};

export default async function BoardPage(props: BoardPageProps) {
  const { id: boardId } = props.params;

  const data = await fetchCards(boardId);

  if (data === null) {
    notFound();
  }

  const { cards, total } = data as {
    cards: StatusesCardType;
    total: number;
  };

  return (
    <div className="cards-wrapper">
      <Statuses initialCards={cards} total={total} boardId={boardId} />
    </div>
  );
}
