import { notFound } from 'next/navigation';

import fetchBoard from '@/app/api/board/fetchBoard';
import fetchCards from '@/app/api/card/fetchCards';
import fetchCardsByStatus from '@/app/api/card/fetchCardsByStatus';
import updateMany from '@/app/api/card/updateMany';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import ScrollShadows from '@/app/components/ScrollShadows';
import StatusColumn from '@/app/components/StatusColumn';
import StatusWrapper from '@/app/components/StatusWrapper';
import { getDictionary } from '@/app/dictionaries';
import type { StatusData } from '@/app/types';

type BoardPageProps = {
  params: {
    boardId: string;
    lang: string;
  };
};

export default async function BoardPage(props: BoardPageProps) {
  const { boardId, lang } = props.params;

  const [cardsRes, board, dictionary] = await Promise.all([
    fetchCards(boardId),
    fetchBoard(boardId),
    getDictionary(lang),
  ]);

  if (board === null || 'error' in board) {
    notFound();
  }

  const { statuses } = cardsRes;

  return (
    <ScrollShadows>
      <AppIntlProvider dictionary={dictionary} locale={lang}>
        <StatusWrapper>
          {board.statuses.map((status, index) => {
            const data = statuses[status.name] as StatusData;

            return (
              <StatusColumn
                key={status.id}
                fetchCardsByStatus={fetchCardsByStatus}
                total={data.total}
                shouldShowAddCardButton={index === 0}
                boardId={board.id}
                initialData={data}
                status={status}
                updateCards={updateMany}
              />
            );
          })}
        </StatusWrapper>
      </AppIntlProvider>
    </ScrollShadows>
  );
}
