'use client';

import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { API_HOST, ROUTES } from '@/app/constants';
import type { BoardType } from '@/app/types';

import ButtonAddBoard from '../ButtonAddBoard';
import ModalDelete from '../ModalDelete';

import styles from './SideBar.module.css';

type SideBarProps = {
  initialBoards: BoardType[];
};

export default function SideBar(props: SideBarProps) {
  const { initialBoards } = props;

  const router = useRouter();

  const params = useParams();

  const [boards, setBoards] = useState(initialBoards);

  const [modalDeleteState, setModalDeleteState] = useState<{
    isOpen: boolean;
    board: BoardType | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    board: null,
    title: 'Delete board',
    description: 'Delete board',
  });

  /**
   * Set modal delete visibility
   */
  const setModalDeleteVisibility = (isVisible: boolean) => () => {
    setModalDeleteState((prev) => ({ ...prev, isOpen: isVisible }));
  };

  /**
   * Delete board handler
   */
  const deleteBoardHandler = (board: BoardType) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setModalDeleteState((prev) => ({
      ...prev,
      isOpen: true,
      board,
      description: `Are you sure you want to delete '${board.name}' board?`,
    }));
  };

  /**
   * Delete board
   */
  const deleteBoard = async () => {
    try {
      const url = new URL(`${API_HOST}/api/board/delete`);
      const res = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ boardId: modalDeleteState.board?.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await res.json();
      if ('error' in json) {
        throw json.error;
      }

      setBoards((prev) => prev.filter((item) => item.id !== modalDeleteState.board?.id));

      if (modalDeleteState.board?.id === params.boardId) {
        const index = boards.findIndex((item) => item.id === modalDeleteState.board?.id);
        const prevIndex = index - 1;

        const prevBoard = boards[prevIndex];
        router.replace(`/boards/${prevBoard.id}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('deleteBoard error - ', error);
    } finally {
      setModalDeleteState((prev) => ({
        ...prev,
        isOpen: false,
        boardId: '',
        description: 'Delete board',
      }));
    }
  };

  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

  return (
    <div className={styles.container}>
      {boards.map((item) => {
        return (
          <Link
            href={ROUTES.showBoard.replace('[id]', item.id)}
            key={item.id}
            className={classNames(styles.board, {
              [styles.boardActive]: params.boardId === item.id,
            })}
          >
            <span>{item.name}</span>
            {!item.protected && (
              <div className={styles.boardActions}>
                <Image
                  alt="Img"
                  src="/edit.svg"
                  width={18}
                  height={18}
                  onClick={() => router.push(ROUTES.editBoard)}
                />
                <Image
                  alt="Img"
                  src="/delete.svg"
                  width={16}
                  height={16}
                  onClick={deleteBoardHandler(item) as VoidFunction}
                />
              </div>
            )}
          </Link>
        );
      })}
      <ButtonAddBoard />
      {modalDeleteState.isOpen && (
        <ModalDelete
          isOpen={modalDeleteState.isOpen}
          closeModal={setModalDeleteVisibility(false)}
          title={modalDeleteState.title}
          description={modalDeleteState.description}
          onDelete={deleteBoard}
        />
      )}
    </div>
  );
}
