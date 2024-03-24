import type { MutableRefObject } from 'react';
import { useEffect } from 'react';

import type { CardLayoutType, StatusType } from '../types';
import getCoords from '../utils/getCoords';

type UseCardLayoutProps = {
  cardElement: MutableRefObject<HTMLDivElement | null>;
  parentScrollTop: number;
  onLayout: (layout: CardLayoutType) => void;
  id: string;
  index: number;
  status: StatusType;
};

export default function useCardLayout(props: UseCardLayoutProps) {
  const { cardElement, parentScrollTop, id, index, onLayout, status } = props;

  useEffect(() => {
    if (cardElement?.current) {
      const coords = getCoords(cardElement.current);

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
