import classNames from 'classnames';
import Image from 'next/image';

import styles from './ButtonAddCard.module.css';

type ButtonAddCardProps = {
  addCard: () => void;
  disabled?: boolean;
  stickyPosition?: boolean;
};

export default function ButtonAddCard(props: ButtonAddCardProps) {
  const { addCard, disabled, stickyPosition } = props;

  return (
    <div className={classNames(styles.container, { [styles.containerSticky]: stickyPosition })}>
      <button className={styles.button} onClick={addCard} disabled={disabled}>
        <span>Add new task card</span>
        <Image alt="Img" src="/plus.svg" width={16} height={16} priority />
      </button>
    </div>
  );
}
