'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { pathOr } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'react-modal';

import deleteBoard from '@/app/api/board/deleteBoard';
import { ROUTES } from '@/app/constants';
import usePrevious from '@/app/hooks/usePrevious';
import type { BoardType } from '@/app/types';

import ButtonAddBoard from '../ButtonAddBoard';
import ModalDelete from '../ModalDelete';

import styles from './SideBar.module.css';

type SideBarProps = {
  boards: BoardType[];
};

export default function SideBar(props: SideBarProps) {
  const { boards } = props;

  const { formatMessage } = useIntl();

  const router = useRouter();

  const params = useParams();

  const pathname = usePathname();
  const pathnamePrev = usePrevious(pathname);

  const buttonAddRef = useRef({ setButtonLoading: (loading: boolean) => loading });

  const [isEditBtnLoading, setIsEditBtnLoading] = useState(false);

  const [modalDeleteState, setModalDeleteState] = useState<{
    isOpen: boolean;
    board: BoardType | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    board: null,
    title: formatMessage({ id: 'board.delete' }),
    description: formatMessage({ id: 'board.delete' }),
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

    const countCards = pathOr(0, ['_count', 'cards'], board);

    setModalDeleteState((prev) => ({
      ...prev,
      isOpen: true,
      board,
      description: formatMessage(
        { id: 'board.delete.question' },
        { boardName: board.name, countCards },
      ),
    }));
  };

  /**
   * Edit board handler
   */
  const editBoardHandler = (board: BoardType) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setIsEditBtnLoading(true);

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
        description: formatMessage({ id: 'board.delete' }),
      }));
    }
  };

  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

  useEffect(() => {
    if (pathnamePrev && pathnamePrev !== pathname && isEditBtnLoading) {
      setIsEditBtnLoading(false);
    }
  }, [isEditBtnLoading, pathnamePrev, pathname]);

  return (
    <div className={styles.container}>
      {boards.map((item) => {
        return (
          <div
            key={item.id}
            className={classNames(styles.board, {
              [styles.boardActive]: params.boardId === item.id,
            })}
            role="presentation"
            onClick={() => {
              if (isEditBtnLoading) {
                setIsEditBtnLoading(false);
              }
              buttonAddRef.current?.setButtonLoading(false);
              router.push(ROUTES.showBoard.replace('[boardId]', item.id));
            }}
          >
            <span>{item.name}</span>
            <div className={styles.boardActions}>
              <button
                className={styles.boardActionWrapper}
                onClick={editBoardHandler(item) as VoidFunction}
              >
                <Image alt="Img" src="/edit.svg" width={18} height={18} />
                {isEditBtnLoading && <div className="animationBlock" />}
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
          </div>
        );
      })}
      <ButtonAddBoard ref={buttonAddRef} />
      {modalDeleteState.isOpen && (
        <ModalDelete
          closeModal={setModalDeleteVisibility(false)}
          title={modalDeleteState.title}
          description={modalDeleteState.description}
          onDelete={deleteBoardComplete}
        />
      )}
    </div>
  );
}
