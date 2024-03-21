import ramdaClone from 'ramda/es/clone';

import type { StatusesStateType } from '../components/Statuses/types';
import type { BoardCardsByStatusResponseType } from '../types';

/**
 * Delete a cart from a board.
 */
const deleteCardFromBoard = ({
  statusesObj,
  status,
}: {
  statusesObj: BoardCardsByStatusResponseType['statuses'];
  status: StatusesStateType['currentDraggable']['status'];
}): BoardCardsByStatusResponseType['statuses'] => {
  const clone = ramdaClone(statusesObj);

  clone[status.name].cards = clone[status.name].cards.filter((item) => item.willBeRemoved !== true);

  return clone;
};

export default deleteCardFromBoard;
