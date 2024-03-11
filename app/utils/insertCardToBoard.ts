import ramdaClone from 'ramda/es/clone';
import insert from 'ramda/es/insert';

import { FAKE_CARD_ID, STATUSES } from '../constants';
import type { CardType, StatusesCardType } from '../types';

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
  status: keyof typeof STATUSES;
  insertBeforeId: string;
  card: CardType;
}): StatusesCardType => {
  const clone = ramdaClone(cardsObj);

  const isInsertBeforeFakeCard = insertBeforeId.indexOf(FAKE_CARD_ID);

  const insertionIndex =
    isInsertBeforeFakeCard === -1
      ? clone[status].findIndex((item) => item.id === insertBeforeId)
      : clone[status].length;

  if (insertionIndex !== -1) {
    clone[status] = insert(insertionIndex, card, clone[status]);
  }

  return clone;
};

export default insertCardToBoard;
