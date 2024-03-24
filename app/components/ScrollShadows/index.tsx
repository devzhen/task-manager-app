'use client';

import classNames from 'classnames';
import debounce from 'debounce';
import { useState, type ReactNode, useEffect, useRef, useCallback } from 'react';

import styles from './ScrollShadows.module.css';

type ScrollShadowsProps = {
  children: ReactNode;
};

const ScrollShadows = (props: ScrollShadowsProps) => {
  const { children } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [shadows, setShadows] = useState({
    left: false,
    right: false,
  });
  const shadowsRef = useRef(shadows);

  const detectShadows = useCallback(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const newShadows = { ...shadows };

    const SCROLL_LEFT_OFFSET = 10;
    const SCROLL_RIGHT_OFFSET = 60;

    const hasScroll =
      scrollContainerRef.current.scrollWidth > scrollContainerRef.current.offsetWidth;

    if (!hasScroll && !shadowsRef.current.left && !shadowsRef.current.right) {
      return;
    }

    if (!hasScroll && (shadowsRef.current.left || shadowsRef.current.right)) {
      setShadows({
        left: false,
        right: false,
      });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollContainerRef.current, shadows]);

  useEffect(() => {
    shadowsRef.current = shadows;
  }, [shadows]);

  useEffect(() => {
    const DEBOUNCE = 200;

    const onScrollHandler = debounce(() => {
      detectShadows();
    }, DEBOUNCE);

    const resizeHandler = debounce(() => {
      detectShadows();
    }, DEBOUNCE);

    const boardStatuses = document.getElementById('board-statuses');

    if (boardStatuses) {
      scrollContainerRef.current = boardStatuses as HTMLDivElement;

      boardStatuses.addEventListener('scroll', onScrollHandler);
    }

    window.addEventListener('resize', resizeHandler);
    detectShadows();

    return () => {
      boardStatuses?.removeEventListener('scroll', onScrollHandler);
      window.removeEventListener('resize', resizeHandler);
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

export default ScrollShadows;
