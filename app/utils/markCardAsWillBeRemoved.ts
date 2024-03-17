import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';

import type { StatusesStateType } from '../components/Statuses/types';
import type { CardType } from '../types';

/**
 * Mark as will be removed
 */
const markCardAsWillBeRemoved = ({
  cardsObj,
  status,
  id,
}: {
  cardsObj: Record<string, CardType[]>;
  status: StatusesStateType['currentDraggable']['status'];
  id: string;
}): Record<string, CardType[]> => {
  let clone = ramdaClone(cardsObj);

  const index = clone[status.name].findIndex((item) => item.id === id);
  if (index !== -1) {
    clone = assocPath([status.name, index, 'willBeRemoved'], true, clone);
  }

  return clone;
};

export default markCardAsWillBeRemoved;
