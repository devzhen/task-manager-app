import ramdaClone from 'ramda/es/clone';

import type { StatusesStateType } from '../components/Statuses/types';
import type { CardType } from '../types';

/**
 * Delete a cart from a board.
 */
const deleteCardFromBoard = ({
  cardsObj,
  status,
}: {
  cardsObj: Record<string, CardType[]>;
  status: StatusesStateType['currentDraggable']['status'];
}): Record<string, CardType[]> => {
  const clone = ramdaClone(cardsObj);

  clone[status.name] = clone[status.name].filter((item) => item.willBeRemoved !== true);

  return clone;
};

export default deleteCardFromBoard;
