import ramdaClone from 'ramda/es/clone';

import type { StatusType, StatusesCardType } from '../types';

/**
 * Delete a cart from a board.
 */
const deleteCardFromBoard = ({
  cardsObj,
  status,
}: {
  cardsObj: StatusesCardType;
  status: StatusType;
}): StatusesCardType => {
  const clone = ramdaClone(cardsObj);

  clone[status.name] = clone[status.name].filter((item) => item.willBeRemoved !== true);

  return clone;
};

export default deleteCardFromBoard;
