import ramdaClone from 'ramda/es/clone';

import { STATUSES } from '../constants';
import type { StatusesCardType, UpdateCardBodyType } from '../types';

/**
 * Update cards position property
 */
const updateCardsPositionProperty = (
  cardsObj: StatusesCardType,
  updateCardsObj: Record<string, UpdateCardBodyType>,
): StatusesCardType => {
  const clone = ramdaClone(cardsObj);

  const keys = Object.keys(clone);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof STATUSES;

    const cardsArr = clone[key];

    for (let j = 0; j < cardsArr.length; j++) {
      const card = cardsArr[j];
      const oldPosition = card.position;

      card.position = j + 1;
      card.willBeRemoved = false;

      if (oldPosition !== card.position || 'oldStatus' in card) {
        const updateData = updateCardsObj[card.id] || {
          id: card.id,
          fields: [],
          values: [],
        };

        updateData.fields.push('status');
        updateData.values.push(card.status);
        updateData.fields.push('position');
        updateData.values.push(card.position);

        updateCardsObj[card.id] = updateData;
      }
    }
  }

  return clone;
};

export default updateCardsPositionProperty;
