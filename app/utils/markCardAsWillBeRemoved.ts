import assocPath from 'ramda/es/assocPath';
import ramdaClone from 'ramda/es/clone';

import type { StatusesStateType } from '../components/Statuses/types';
import type { BoardCardsByStatusResponseType } from '../types';

/**
 * Mark as will be removed
 */
const markCardAsWillBeRemoved = ({
  statusesObj,
  status,
  id,
}: {
  statusesObj: BoardCardsByStatusResponseType['statuses'];
  status: StatusesStateType['currentDraggable']['status'];
  id: string;
}): BoardCardsByStatusResponseType['statuses'] => {
  let clone = ramdaClone(statusesObj);

  const index = clone[status.name].cards.findIndex((item) => item.id === id);
  if (index !== -1) {
    clone = assocPath([status.name, 'cards', index, 'willBeRemoved'], true, clone);
  }

  return clone;
};

export default markCardAsWillBeRemoved;
