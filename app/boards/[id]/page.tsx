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

  const cards = (await fetchCards(boardId)) as StatusesCardType;

  if (!cards) {
    notFound();
  }

  return (
    <div className="cards-wrapper">
      <Statuses initialCards={cards} />
    </div>
  );
}
