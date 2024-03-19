import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCards from '@/app/api/card/fetchCards';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import CardsWrapper from '@/app/components/CardsWrapper';
import Statuses from '@/app/components/Statuses';
import { getDictionary } from '@/app/dictionaries';
import type { CardType } from '@/app/types';

type BoardPageProps = {
  params: {
    boardId: string;
    lang: string;
  };
};

export default async function BoardPage(props: BoardPageProps) {
  const { boardId, lang } = props.params;

  const [cardsObj, board, dictionary] = await Promise.all([
    fetchCards(boardId),
    fetchBoard(boardId),
    getDictionary(lang),
  ]);

  if (cardsObj === null) {
    notFound();
  }

  const { cards, total } = cardsObj as {
    cards: Record<string, CardType[]>;
    total: number;
  };

  return (
    <CardsWrapper>
      <AppIntlProvider dictionary={dictionary} locale={lang}>
        <Statuses initialCards={cards} total={total} board={board} />
      </AppIntlProvider>
    </CardsWrapper>
  );
}
