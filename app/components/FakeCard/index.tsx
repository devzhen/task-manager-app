import { useRef } from 'react';

import { STATUSES_OBJ } from '@/app/constants';
import useCardLayout from '@/app/hooks/useCardLayout';
import type { CardLayoutType } from '@/app/types';

import style from './FakeCard.module.css';

type FakeCardProps = {
  id: string;
  index: number;
  hovered: boolean;
  onLayout: (layout: CardLayoutType) => void;
  status: keyof typeof STATUSES_OBJ;
  parentScrollTop: number;
};

export default function FakeCard(props: FakeCardProps) {
  const { index, hovered, onLayout, id, status, parentScrollTop } = props;

  const ref = useRef(null);

  const classNames = [style.container];
  if (hovered) {
    classNames.push(style.containerActive);
  }

  if (index == 0) {
    classNames.push(style.containerMargin);
  }

  useCardLayout({
    cardElement: ref.current,
    parentScrollTop,
    index,
    id,
    status,
    onLayout,
  });

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
