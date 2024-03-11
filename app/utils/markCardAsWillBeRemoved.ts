import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';

import { STATUSES } from '../constants';
import type { StatusesCardType } from '../types';

/**
 * Mark as will be removed
 */
const markCardAsWillBeRemoved = ({
  cardsObj,
  status,
  id,
}: {
  cardsObj: StatusesCardType;
  status: keyof typeof STATUSES;
  id: string;
}): StatusesCardType => {
  let clone = ramdaClone(cardsObj);

  const index = clone[status].findIndex((item) => item.id === id);
  if (index !== -1) {
    clone = assocPath([status, index, 'willBeRemoved'], true, clone);
  }

  return clone;
};

export default markCardAsWillBeRemoved;
