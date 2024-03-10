import { useEffect } from 'react';

import { STATUSES } from '../constants';
import type { CardLayoutType } from '../types';
import getCoords from '../utils/getCoords';

type UseCardLayoutProps = {
  cardElement: HTMLDivElement | null;
  parentScrollTop: number;
  onLayout: (layout: CardLayoutType) => void;
  id: string;
  index: number;
  status: keyof typeof STATUSES;
};

export default function useCardLayout(props: UseCardLayoutProps) {
  const { cardElement, parentScrollTop, id, index, onLayout, status } = props;

  useEffect(() => {
    if (cardElement) {
      const coords = getCoords(cardElement);

      const layout = {
        id,
        top: coords.top + parentScrollTop,
        middle: coords.middle + parentScrollTop,
        bottom: coords.bottom + parentScrollTop,
        index,
        status,
      };

      onLayout(layout);
    }
  }, [index, id, status, onLayout, parentScrollTop, cardElement]);
}
