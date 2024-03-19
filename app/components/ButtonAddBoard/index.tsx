import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';

import { ROUTES } from '@/app/constants';
import { DictionaryContext } from '@/dictionaries/DictionaryProvider';

import styles from './ButtonAddBoard.module.css';

export default function ButtonAddBoard() {
  const dictionary = useContext(DictionaryContext);

  const pathname = usePathname();

  const router = useRouter();

  if (pathname === ROUTES.addBoard) {
    return null;
  }

  return (
    <button className={styles.container} onClick={() => router.push(ROUTES.addBoard)}>
      <Image alt="Img" src="/add-board.svg" width={16} height={16} priority />
      <span>{dictionary.board.addNew}</span>
    </button>
  );
}
