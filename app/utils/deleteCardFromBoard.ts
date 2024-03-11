import ramdaClone from 'ramda/es/clone';

import { STATUSES } from '../constants';
import type { StatusesCardType } from '../types';

/**
 * Delete a cart from a board.
 */
const deleteCardFromBoard = ({
  cardsObj,
  status,
}: {
  cardsObj: StatusesCardType;
  status: keyof typeof STATUSES;
}): StatusesCardType => {
  const clone = ramdaClone(cardsObj);

  clone[status] = clone[status].filter((item) => item.willBeRemoved !== true);

  return clone;
};

export default deleteCardFromBoard;
