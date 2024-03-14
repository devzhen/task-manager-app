import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './ButtonAddCard.module.css';

type ButtonAddCardProps = {
  disabled?: boolean;
  stickyPosition?: boolean;
  boardId: string;
};

export default function ButtonAddCard(props: ButtonAddCardProps) {
  const { disabled, stickyPosition, boardId } = props;

  const router = useRouter();

  const addCard = () => {
    router.push(`/cards/${boardId}/add`);
  };

  return (
    <div className={classNames(styles.container, { [styles.containerSticky]: stickyPosition })}>
      <button className={styles.button} onClick={addCard} disabled={disabled}>
        <span>Add new task card</span>
        <Image alt="Img" src="/plus.svg" width={16} height={16} priority />
      </button>
    </div>
  );
}
