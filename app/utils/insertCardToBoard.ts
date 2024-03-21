import ramdaClone from 'ramda/es/clone';
import insert from 'ramda/es/insert';

import type { StatusesStateType } from '../components/Statuses/types';
import { FAKE_CARD_ID } from '../constants';
import type { BoardCardsByStatusResponseType, CardType } from '../types';

/**
 * Insert a cart to a board.
 */
const insertCardToBoard = ({
  statusesObj,
  status,
  insertBeforeId,
  card,
}: {
  statusesObj: BoardCardsByStatusResponseType['statuses'];
  status: StatusesStateType['currentDraggable']['status'];
  insertBeforeId: string;
  card: CardType;
}): BoardCardsByStatusResponseType['statuses'] => {
  const clone = ramdaClone(statusesObj);

  const isInsertBeforeFakeCard = insertBeforeId.indexOf(FAKE_CARD_ID);

  const insertionIndex =
    isInsertBeforeFakeCard === -1
      ? clone[status.name].cards.findIndex((item) => item.id === insertBeforeId)
      : (clone[status.name].cards || []).length;

  if (insertionIndex !== -1) {
    clone[status.name].cards = insert(insertionIndex, card, clone[status.name].cards || []);
  }

  return clone;
};

export default insertCardToBoard;
