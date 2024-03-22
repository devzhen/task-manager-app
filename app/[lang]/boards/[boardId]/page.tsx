import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCards from '@/app/api/card/fetchCards';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import CardsWrapper from '@/app/components/CardsWrapper';
import Statuses from '@/app/components/Statuses';
import { getDictionary } from '@/app/dictionaries';

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

  if (board === null || 'error' in board) {
    notFound();
  }

  const { statuses, total } = cardsObj;

  return (
    <CardsWrapper>
      <AppIntlProvider dictionary={dictionary} locale={lang}>
        <Statuses initialStatuses={statuses} total={total} board={board} />
      </AppIntlProvider>
    </CardsWrapper>
  );
}
