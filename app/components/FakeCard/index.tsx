import { useEffect, useRef } from 'react';

import { STATUSES } from '@/app/constants';
import type { CardLayoutType } from '@/app/types';
import getCoords from '@/app/utils/getCoords';

import style from './FakeCard.module.css';

type FakeCardProps = {
  id: string;
  index: number;
  hovered: boolean;
  onLayout: (layout: CardLayoutType) => void;
  status: keyof typeof STATUSES;
};

export default function FakeCard(props: FakeCardProps) {
  const { index, hovered, onLayout, id, status } = props;

  const ref = useRef(null);

  const classNames = [style.container];
  if (hovered) {
    classNames.push(style.containerActive);
  }

  if (index == 0) {
    classNames.push(style.containerMargin);
  }

  useEffect(() => {
    if (ref.current) {
      const coords = getCoords(ref.current);

      const layout = {
        id,
        top: coords.top,
        middle: coords.bottom,
        bottom: coords.bottom,
        index,
        status,
      };

      onLayout(layout);
    }
  }, [index, id, onLayout, status]);

  return (
    <div
      ref={ref}
      className={classNames.join(' ')}
      data-id={id}
      data-role={id}
      data-index={index}
    />
  );
}
