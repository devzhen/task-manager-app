import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import Modal from 'react-modal';

import { BOARD_NAME_MIN_LENGTH } from '@/app/constants';
import type { BoardType } from '@/app/types';

import styles from './ModalAddBoard.module.css';

Modal.setAppElement('.container');

type ModalAddBoardProps = {
  isOpen: boolean;
  closeModal: () => void;
  boardNames: string[];
  createBoard: (name: string, board: BoardType | null) => void;
  modalError?: string;
  board: BoardType | null;
};

export default function ModalAddBoard(props: ModalAddBoardProps) {
  const { isOpen, closeModal, boardNames, createBoard, modalError, board } = props;

  const [name, setName] = useState(board?.name || '');
  const [error, setError] = useState(modalError || '');
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = name.trim().length <= BOARD_NAME_MIN_LENGTH;

  const createBoardHandler = () => {
    if (boardNames.map((item) => item.trim().toLowerCase()).includes(name.trim())) {
      setError(`The '${name}' board is present.`);

      return;
    }

    setIsLoading(true);
    createBoard(name.trim(), board);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }

    setName(e.target.value);
  };

  useEffect(() => {
    if (modalError && isLoading) {
      setIsLoading(false);
    }

    if (modalError && error !== modalError) {
      setError(modalError);
    }
  }, [modalError, isLoading, error]);

  return (
    <Modal isOpen={isOpen} contentLabel="Example Modal">
      <div className={styles.header}>
        <span>New board</span>
        <Image
          src="/close.svg"
          width={18}
          height={18}
          alt="Img"
          draggable={false}
          onClick={closeModal}
        />
      </div>
      <div className={styles.body}>
        <label htmlFor="board-name">Board name</label>
        <div className={styles.inputWrapper}>
          <input type="text" id="board-name" value={name} onChange={onChangeHandler} />
        </div>
        <div className={styles.error}>{error && <span className="error">{error}</span>}</div>
      </div>
      <div className={styles.footer}>
        <button disabled={isDisabled} onClick={createBoardHandler}>
          {!isLoading && !board?.name && <span>Create board</span>}
          {!isLoading && board?.name && <span>Update board</span>}
          {isLoading && <div className="loader" />}
        </button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </Modal>
  );
}
