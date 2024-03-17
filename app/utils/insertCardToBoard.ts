import ramdaClone from 'ramda/es/clone';
import insert from 'ramda/es/insert';

import type { StatusesStateType } from '../components/Statuses/types';
import { FAKE_CARD_ID } from '../constants';
import type { CardType } from '../types';

/**
 * Insert a cart to a board.
 */
const insertCardToBoard = ({
  cardsObj,
  status,
  insertBeforeId,
  card,
}: {
  cardsObj: Record<string, CardType[]>;
  status: StatusesStateType['currentDraggable']['status'];
  insertBeforeId: string;
  card: CardType;
}): Record<string, CardType[]> => {
  const clone = ramdaClone(cardsObj);

  const isInsertBeforeFakeCard = insertBeforeId.indexOf(FAKE_CARD_ID);

  const insertionIndex =
    isInsertBeforeFakeCard === -1
      ? clone[status.name].findIndex((item) => item.id === insertBeforeId)
      : (clone[status.name] || []).length;

  if (insertionIndex !== -1) {
    clone[status.name] = insert(insertionIndex, card, clone[status.name] || []);
  }

  return clone;
};

export default insertCardToBoard;
