import classNames from 'classnames';
import { useRef } from 'react';

import useCardLayout from '@/app/hooks/useCardLayout';
import type { CardLayoutType, StatusType } from '@/app/types';

import style from './FakeCard.module.css';

type FakeCardProps = {
  id: string;
  index: number;
  highlighted: boolean;
  onLayout: (layout: CardLayoutType) => void;
  status: StatusType;
  parentScrollTop: number;
};

export default function FakeCard(props: FakeCardProps) {
  const { index, highlighted, onLayout, id, status, parentScrollTop } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  useCardLayout({
    cardElement: ref,
    parentScrollTop,
    index,
    id,
    status,
    onLayout,
  });

  return (
    <div
      ref={ref}
      className={classNames(style.container, {
        [style.containerActive]: highlighted,
        [style.containerMargin]: index === 0,
      })}
      data-id={id}
      data-role={id}
      data-index={index}
    />
  );
}
