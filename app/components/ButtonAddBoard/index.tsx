import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

import { ROUTES } from '@/app/constants';

import styles from './ButtonAddBoard.module.css';

export default function ButtonAddBoard() {
  const pathname = usePathname();

  const router = useRouter();

  if (pathname === ROUTES.addBoard) {
    return null;
  }

  return (
    <button className={styles.container} onClick={() => router.push(ROUTES.addBoard)}>
      <Image alt="Img" src="/add-board.svg" width={16} height={16} priority />
      <span>
        <FormattedMessage id="board.addNew" />
      </span>
    </button>
  );
}
