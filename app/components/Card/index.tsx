import classNames from 'classnames';
import Image from 'next/image';
import { useRef, useState } from 'react';

import useCardLayout from '@/app/hooks/useCardLayout';
import type { AttachmentType, CardLayoutType, StatusType, TagLinkerType } from '@/app/types';

import Tags from '../Tags';

import styles from './Card.module.css';

type CardProps = {
  attachments: AttachmentType[];
  description?: string;
  highlighted: boolean;
  id: string;
  index: number;
  onClick: (id: string) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onLayout: (layout: CardLayoutType) => void;
  parentScrollTop: number;
  status: StatusType;
  tags: TagLinkerType[];
  title: string;
};

export default function Card(props: CardProps) {
  const {
    attachments,
    highlighted,
    id,
    index,
    onClick,
    onDragEnd,
    onDragStart,
    onLayout,
    parentScrollTop,
    status,
    tags,
    title,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const onClickHandler = () => {
    setIsLoading(true);
    onClick(id);
  };

  useCardLayout({
    cardElement: ref,
    parentScrollTop,
    index,
    id,
    status,
    onLayout,
  });

  const attachment = attachments[0];

  return (
    <div
      ref={ref}
      className={classNames(styles.container, {
        [styles.containerActive]: highlighted,
        [styles.containerLoading]: isLoading,
      })}
      data-id={id}
      data-role="card"
      data-index={index}
      data-status={status.name}
      draggable
      onDragStart={onDragStart as VoidFunction}
      onDragEnd={onDragEnd as VoidFunction}
      onClick={onClickHandler as VoidFunction}
      role="presentation"
    >
      <div className={styles.content}>
        {attachment && (
          <div className={styles.imageWrapper}>
            <div className={styles.imageLoaderWrapper}>
              <div className="loader" />
            </div>
            <Image
              alt="Img"
              src={attachment.url}
              fill
              sizes="100%"
              style={{
                objectFit: 'cover',
              }}
              priority
              draggable={false}
            />
          </div>
        )}
        <span className={styles.title}>{title}</span>
        <Tags tags={tags} />
      </div>
      {isLoading && <div className="animationBlock" />}
    </div>
  );
}
