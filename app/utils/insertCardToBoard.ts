import ramdaClone from 'ramda/es/clone';
import insert from 'ramda/es/insert';

import { FAKE_CARD_ID } from '../constants';
import type { CardType, StatusType, StatusesCardType } from '../types';

/**
 * Insert a cart to a board.
 */
const insertCardToBoard = ({
  cardsObj,
  status,
  insertBeforeId,
  card,
}: {
  cardsObj: StatusesCardType;
  status: StatusType;
  insertBeforeId: string;
  card: CardType;
}): StatusesCardType => {
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
