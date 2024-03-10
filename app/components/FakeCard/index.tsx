import { useEffect, useRef } from 'react';

import { STATUSES_OBJ } from '@/app/constants';
import useCardLayout from '@/app/hooks/useCardLayout';
import usePrevious from '@/app/hooks/usePrevious';
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

  const prevIndex = usePrevious(index);

  const ref = useRef<HTMLDivElement | null>(null);

  const classNames = [style.container];
  if (hovered) {
    classNames.push(style.containerActive);
  }

  if (index == 0) {
    classNames.push(style.containerMargin);
  }

  const scrollToBottom = () => {
    if (!ref.current || !prevIndex) {
      return;
    }

    if (index <= prevIndex) {
      return;
    }

    // Scroll to bottom
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, prevIndex]);

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
