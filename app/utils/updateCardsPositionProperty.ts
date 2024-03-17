import ramdaClone from 'ramda/es/clone';

import type { CardType, UpdateCardBodyType } from '../types';

/**
 * Update cards position property
 */
const updateCardsPositionProperty = (
  cardsObj: Record<string, CardType[]>,
  updateCardsObj: Record<string, UpdateCardBodyType>,
): Record<string, CardType[]> => {
  const clone = ramdaClone(cardsObj);

  const keys = Object.keys(clone);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

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

        updateData.fields.push('statusId');
        updateData.values.push(card.status.id);
        updateData.fields.push('position');
        updateData.values.push(card.position);

        updateCardsObj[card.id] = updateData;
      }
    }
  }

  return clone;
};

export default updateCardsPositionProperty;
