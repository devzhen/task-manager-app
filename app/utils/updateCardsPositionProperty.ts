import ramdaClone from 'ramda/es/clone';

import { STATUSES } from '../constants';
import type { StatusesCardType } from '../types';

/**
 * Update cards position property
 */
const updateCardsPositionProperty = (cardsObj: StatusesCardType): StatusesCardType => {
  const clone = ramdaClone(cardsObj);

  const keys = Object.keys(clone);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof STATUSES;

    const cardsArr = clone[key];

    for (let j = 0; j < cardsArr.length; j++) {
      const card = cardsArr[j];
      card.position = j + 1;
      card.willBeRemoved = false;
    }
  }

  return clone;
};

export default updateCardsPositionProperty;
