'use client';

import classNames from 'classnames';
import { useState, type ReactNode, useEffect, useRef } from 'react';

import styles from './CardsWrapper.module.css';

type CardsWrapperProps = {
  children: ReactNode;
};

const CardsWrapper = (props: CardsWrapperProps) => {
  const { children } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [shadows, setShadows] = useState({
    left: false,
    right: false,
  });

  const detectShadows = () => {
    if (!scrollContainerRef.current) {
      return;
    }

    const newShadows = { ...shadows };

    const SCROLL_LEFT_OFFSET = 10;
    const SCROLL_RIGHT_OFFSET = 60;

    const hasScroll =
      scrollContainerRef.current.scrollWidth > scrollContainerRef.current.offsetWidth;

    if (!hasScroll) {
      return;
    }

    newShadows.right = true;

    const isScrolledLeft = scrollContainerRef.current.scrollLeft > SCROLL_LEFT_OFFSET;

    const scrollRightDelta =
      scrollContainerRef.current.scrollWidth -
      scrollContainerRef.current.scrollLeft -
      scrollContainerRef.current.offsetWidth;

    if (isScrolledLeft) {
      newShadows.left = true;
    }

    if (scrollRightDelta <= SCROLL_RIGHT_OFFSET) {
      newShadows.right = false;
    }

    setShadows(newShadows);
  };

  useEffect(() => {
    const onScrollHandler = () => {
      detectShadows();
    };

    const boardStatuses = document.getElementById('board-statuses');

    if (boardStatuses) {
      scrollContainerRef.current = boardStatuses as HTMLDivElement;

      detectShadows();
      boardStatuses.addEventListener('scroll', onScrollHandler);
    }

    return () => {
      boardStatuses?.removeEventListener('scroll', onScrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={classNames(styles.leftShadow, {
          [styles.shadowVisible]: shadows.left,
        })}
      />
      {children}
      <div
        className={classNames(styles.rightShadow, {
          [styles.shadowVisible]: shadows.right,
        })}
      />
    </div>
  );
};

export default CardsWrapper;
