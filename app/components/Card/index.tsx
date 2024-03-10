import Image from 'next/image';
import { useRef } from 'react';

import { STATUSES_OBJ } from '@/app/constants';
import useCardLayout from '@/app/hooks/useCardLayout';
import type { AttachmentType, CardLayoutType, TagType } from '@/app/types';

import Tags from '../Tags';

import styles from './Card.module.css';

type CardProps = {
  attachments: AttachmentType[];
  hovered: boolean;
  id: string;
  index: number;
  title: string;
  description?: string;
  onDragEnd: (e: DragEvent) => void;
  onDragStart: (e: DragEvent) => void;
  onLayout: (layout: CardLayoutType) => void;
  status: keyof typeof STATUSES_OBJ;
  tags: TagType[];
  parentScrollTop: number;
};

export default function Card(props: CardProps) {
  const {
    attachments,
    title,
    id,
    status,
    index,
    onDragStart,
    hovered,
    onDragEnd,
    onLayout,
    tags,
    parentScrollTop,
  } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  const onDragStartHandler = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('id', id);
      e.dataTransfer.setData('status', status);
      e.dataTransfer.setData('index', `${index}`);
    }

    onDragStart(e);
  };

  const classes = [styles.container];
  if (hovered) {
    classes.push(styles.containerActive);
  }

  useCardLayout({
    cardElement: ref.current,
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
      className={classes.join(' ')}
      data-id={id}
      data-role="card"
      data-index={index}
      data-status={status}
      draggable
      onDragStart={onDragStartHandler as VoidFunction}
      onDragEnd={onDragEnd as VoidFunction}
    >
      <div className={styles.content}>
        {attachment && (
          <div className={styles.imageWrapper}>
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
    </div>
  );
}
