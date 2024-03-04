import Image from 'next/image';

import { BoardType } from '@/app/types';

import styles from './SideBar.module.css';

type SideBarProps = {
  boards: BoardType[];
};

export default function SideBar(props: SideBarProps) {
  const { boards } = props;

  return (
    <div className={styles.container}>
      {boards.map((item) => {
        return (
          <button key={item.id} className={styles.board}>
            <span>{item.name}</span>
          </button>
        );
      })}
      <button className={styles.board}>
        <Image alt="Img" src="/add-board.svg" width={16} height={16} />
        <span>Add board</span>
      </button>
    </div>
  );
}
