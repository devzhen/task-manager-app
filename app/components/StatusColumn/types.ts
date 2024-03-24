import type { CardType, StatusData } from '@/app/types';

export type DraggableState = {
  initialized: boolean;
  draggable: {
    cardId: string | null;
    statusId: string | null;
    index: number | null;
    card: CardType | null;
  };
  highlighted: {
    cardId: string | null;
    statusId: string | null;
    index: number | null;
  };
};

export type StatusDataState = StatusData & { isNewCardInserted: boolean };
