'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import compose from 'ramda/es/compose';
import insert from 'ramda/es/insert';
import last from 'ramda/es/last';
import split from 'ramda/es/split';
import remove from 'ramda/src/remove';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { API_HOST } from '@/app/constants';
import type { BoardType } from '@/app/types';

import ModalAddBoard from '../ModalAddBoard';
import ModalDelete from '../ModalDelete';

import styles from './SideBar.module.css';

type SideBarProps = {
  initialBoards: BoardType[];
};

export default function SideBar(props: SideBarProps) {
  const { initialBoards } = props;

  const pathname = usePathname();

  const router = useRouter();

  const [boards, setBoards] = useState(initialBoards);

  const [modalAddState, setModalAddState] = useState<{
    isOpen: boolean;
    error: string | undefined;
    board: BoardType | null;
  }>({
    isOpen: false,
    error: undefined,
    board: null,
  });

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
   * Set modal visibility
   */
  const setModalAddVisibility = (isVisible: boolean) => () => {
    setModalAddState((prev) => ({ ...prev, isOpen: isVisible }));
  };

  /**
   * Set modal delete visibility
   */
  const setModalDeleteVisibility = (isVisible: boolean) => () => {
    setModalDeleteState((prev) => ({ ...prev, isOpen: isVisible }));
  };

  /**
   * Create board
   */
  const createBoard = async (name: string, board: BoardType | null) => {
    const method = board?.id ? 'PUT' : 'POST';
    const apiUrl = board?.id ? `${API_HOST}/api/board/update` : `${API_HOST}/api/board/add`;
    const body = board?.id
      ? JSON.stringify({ name, id: board.id, created: board.createdAt })
      : JSON.stringify({ name });

    try {
      const url = new URL(apiUrl);
      const res = await fetch(url.toString(), {
        method,
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await res.json();
      if ('error' in json) {
        throw json.error;
      }

      if (board?.id) {
        // Update
        const index = boards.findIndex((item) => item.id === board.id);

        setBoards((prev) => compose(insert(index, json.board), remove(index, 1))(prev));

        router.push(`/boards/${board.id}`);
      } else {
        // Add
        setBoards((prev) => [...prev, json.board]);

        router.push(`/boards/${json.board.id}`);
      }

      setModalAddState({
        isOpen: false,
        error: undefined,
        board: null,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('createBoard error - ', error);

      const err = typeof error === 'string' ? error : (error as Error).message;

      setModalAddState((prev) => ({ ...prev, error: err }));
    }
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
   * Update board handler
   */
  const updateBoardHandler = (board: BoardType) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setModalAddState((prev) => ({ ...prev, isOpen: true, board }));
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

      const activeBoardId = compose(last, split('/'))(pathname) as string;

      if (modalDeleteState.board?.id === activeBoardId) {
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
        const className = [styles.board];

        const activeBoardId = compose(last, split('/'))(pathname) as string;

        if (activeBoardId === item.id) {
          className.push(styles.boardActive);
        }

        return (
          <Link href={`/boards/${item.id}`} key={item.id} className={className.join(' ')}>
            <span>{item.name}</span>
            {!item.protected && (
              <div className={styles.boardActions}>
                <Image
                  alt="Img"
                  src="/edit.svg"
                  width={18}
                  height={18}
                  onClick={updateBoardHandler(item) as VoidFunction}
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
      <button
        className={`${styles.board} ${styles.boardAddItem}`}
        onClick={setModalAddVisibility(true)}
      >
        <Image alt="Img" src="/add-board.svg" width={16} height={16} priority />
        <span>Add new board</span>
      </button>
      {modalAddState.isOpen && (
        <ModalAddBoard
          isOpen={modalAddState.isOpen}
          modalError={modalAddState.error}
          closeModal={setModalAddVisibility(false)}
          boardNames={boards.map((item) => item.name)}
          createBoard={createBoard}
          board={modalAddState.board}
        />
      )}
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
