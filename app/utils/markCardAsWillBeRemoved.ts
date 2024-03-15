import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';

import type { StatusType, StatusesCardType } from '../types';

/**
 * Mark as will be removed
 */
const markCardAsWillBeRemoved = ({
  cardsObj,
  status,
  id,
}: {
  cardsObj: StatusesCardType;
  status: StatusType;
  id: string;
}): StatusesCardType => {
  let clone = ramdaClone(cardsObj);

  const index = clone[status.name].findIndex((item) => item.id === id);
  if (index !== -1) {
    clone = assocPath([status.name, index, 'willBeRemoved'], true, clone);
  }

  return clone;
};

export default markCardAsWillBeRemoved;
