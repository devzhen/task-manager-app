'use client';

import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { pathOr } from 'ramda';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import deleteBoard from '@/app/api/board/deleteBoard';
import { ROUTES } from '@/app/constants';
import type { BoardType, DictionaryType } from '@/app/types';
import DictionaryProvider from '@/dictionaries/DictionaryProvider';

import ButtonAddBoard from '../ButtonAddBoard';
import ModalDelete from '../ModalDelete';

import styles from './SideBar.module.css';

type SideBarProps = {
  boards: BoardType[];
  dictionary: DictionaryType;
};

export default function SideBar(props: SideBarProps) {
  const { boards, dictionary } = props;

  const router = useRouter();

  const params = useParams();

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
  const deleteBoardPrepare = (board: BoardType) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    let description = `Are you sure you want to delete '${board.name}' board?`;
    const countCards = pathOr(0, ['_count', 'cards'], board);
    if (countCards > 0) {
      description = `${description} There are ${countCards} cards. All data will be removed.`;
    }

    setModalDeleteState((prev) => ({
      ...prev,
      isOpen: true,
      board,
      description,
    }));
  };

  /**
   * Edit board handler
   */
  const editBoardHandler = (board: BoardType) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    router.push(ROUTES.editBoard.replace('[boardId]', board.id));
  };

  /**
   * Delete board
   */
  const deleteBoardComplete = async () => {
    try {
      await deleteBoard(modalDeleteState.board?.id as string);

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
        board: null,
        description: 'Delete board',
      }));
    }
  };

  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <div className={styles.container}>
        {boards.map((item) => {
          return (
            <Link
              href={ROUTES.showBoard.replace('[boardId]', item.id)}
              key={item.id}
              className={classNames(styles.board, {
                [styles.boardActive]: params.boardId === item.id,
              })}
            >
              <span>{item.name}</span>
              <div className={styles.boardActions}>
                <button
                  className={styles.boardActionWrapper}
                  onClick={editBoardHandler(item) as VoidFunction}
                >
                  <Image alt="Img" src="/edit.svg" width={18} height={18} />
                </button>
                {!item.protected && (
                  <button
                    className={styles.boardActionWrapper}
                    onClick={deleteBoardPrepare(item) as VoidFunction}
                  >
                    <Image alt="Img" src="/delete.svg" width={16} height={16} />
                  </button>
                )}
              </div>
            </Link>
          );
        })}
        <ButtonAddBoard />
        {modalDeleteState.isOpen && (
          <ModalDelete
            closeModal={setModalDeleteVisibility(false)}
            title={modalDeleteState.title}
            description={modalDeleteState.description}
            onDelete={deleteBoardComplete}
          />
        )}
      </div>
    </DictionaryProvider>
  );
}
