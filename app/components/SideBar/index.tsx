'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BoardType } from '@/app/types';

import styles from './SideBar.module.css';

type SideBarProps = {
  boards: BoardType[];
};

export default function SideBar(props: SideBarProps) {
  const { boards } = props;

  const pathname = usePathname();

  return (
    <div className={styles.container}>
      {boards.map((item) => {
        const className = [styles.board];

        if (pathname === item.href) {
          className.push(styles.boardActive);
        }

        return (
          <Link href={item.href} key={item.id} className={className.join(' ')}>
            <span>{item.name}</span>
          </Link>
        );
      })}
      <button className={styles.board}>
        <Image alt="Img" src="/add-board.svg" width={16} height={16} priority />
        <span>Add new board</span>
      </button>
    </div>
  );
}
