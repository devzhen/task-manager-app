import { Dispatch, Fragment, SetStateAction, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { STATUSES } from '@/app/constants';
import { CardType } from '@/app/types';
import getCoords from '@/app/utils/getCoords';

import Card from '../Card';
import DragHelpLine from '../DragHelpLine';

import styles from './StatusRow.module.css';

type StatusRowProps = {
  name: string;
  color: string;
  cards: CardType[];
  status: keyof typeof STATUSES;
  onDrop: ({
    id,
    name,
    status,
    oldStatus,
  }: {
    id: string;
    name: string;
    status: keyof typeof STATUSES;
    oldStatus: keyof typeof STATUSES;
    deleteIndex: number;
  }) => void;
  currentHoveredCardId: string | undefined;
  setCurrentHoveredCardId: Dispatch<SetStateAction<string | undefined>>;
};

export default function StatusRow(props: StatusRowProps) {
  const { name, color, cards, onDrop, status, currentHoveredCardId, setCurrentHoveredCardId } =
    props;

  const dragContainerRef = useRef<HTMLDivElement | null>(null);

  const currentHoveredCardIdRef = useRef(currentHoveredCardId);

  const [, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { id: string; name: string; status: keyof typeof STATUSES; index: number }) => {
      console.log(2222);
      onDrop({ ...item, oldStatus: item.status, status, deleteIndex: item.index });
    },
    hover: (item, monitor) => {
      // Cursor's offset
      const offset = monitor.getClientOffset();

      if (offset) {
        const elements = document.elementsFromPoint(offset.x, offset.y);
        elements.forEach((cardItem) => {
          if (
            cardItem.getAttribute('data-role') === 'card' &&
            item.id !== cardItem.getAttribute('data-id')
          ) {
            console.log(cardItem);
            const coords = getCoords(cardItem);

            let hoveredCardId;

            // Highlight top line
            if (offset.y > coords.top && offset.y <= coords.top + coords.height / 2) {
              hoveredCardId = cardItem.previousElementSibling?.getAttribute('data-line-for');
            }

            // Highlight bottom line
            if (offset.y > coords.top + coords.height / 2 && offset.y < coords.bottom) {
              hoveredCardId = cardItem.nextElementSibling?.getAttribute('data-line-for');
            }

            if (hoveredCardId && currentHoveredCardIdRef.current !== hoveredCardId) {
              setCurrentHoveredCardId(hoveredCardId);
            }
          }
        });
      }
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        item: monitor.getItem(),
        offset: monitor.getDifferenceFromInitialOffset(),
      };
    },
  }));

  useEffect(() => {
    currentHoveredCardIdRef.current = currentHoveredCardId;
  }, [currentHoveredCardId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ backgroundColor: color }} />
        <span>{name} (0)</span>
      </div>
      <div
        className={styles.cardWrappers}
        ref={(ref) => {
          dragContainerRef.current = ref;
          drop(ref);
        }}
      >
        <DragHelpLine
          hoveredCardId={cards[0]?.id}
          currentHoveredCardId={currentHoveredCardId}
          order={0}
        />
        {cards.map((card, index) => {
          return (
            <Fragment key={card.id}>
              <Card name={card.name} id={card.id} status={card.status} index={index} />
              <DragHelpLine
                hoveredCardId={cards[index + 1]?.id || `${card.id}-last`}
                currentHoveredCardId={currentHoveredCardId}
                order={index + 1}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
