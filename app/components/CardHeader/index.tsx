'use client';

import { FormattedMessage } from 'react-intl';

import ButtonDeleteCard from '../ButtonDeleteCard';

import styles from './CardHeader.module.css';

type CardHeaderProps = {
  cardId: string;
  boardId: string;
};

export default function CardHeader(props: CardHeaderProps) {
  const { cardId, boardId } = props;

  return (
    <div className={styles.header}>
      <h2>
        <FormattedMessage id="card.details" />
      </h2>
      {cardId && <ButtonDeleteCard cardId={cardId} boardId={boardId} />}
    </div>
  );
}
