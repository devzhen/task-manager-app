'use client';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import deleteCard from '@/app/api/card/deleteCard';
import { ROUTES } from '@/app/constants';

import ModalDelete from '../ModalDelete';

import styles from './ButtonDeleteCard.module.css';

type ButtonDeleteCardProps = {
  cardId: string;
  boardId: string;
};

export default function ButtonDeleteCard(props: ButtonDeleteCardProps) {
  const { cardId, boardId } = props;

  const router = useRouter();

  const [modalDeleteState, setModalDeleteState] = useState({
    isOpen: false,
    title: 'Delete Task',
    description: 'Are you sure you want to delete this task?',
  });

  const setModalDeleteVisibility = (isOpen: boolean) => () => {
    setModalDeleteState((prev) => ({
      ...prev,
      isOpen,
    }));
  };

  const deleteCardHandler = async () => {
    await deleteCard({ cardId, boardId });

    router.replace(ROUTES.showBoard.replace('[boardId]', boardId));
  };

  useEffect(() => {
    Modal.setAppElement('.container');
  }, []);

  return (
    <>
      <div className={classNames(styles.container)}>
        <button className={styles.button} onClick={setModalDeleteVisibility(true)}>
          <span>Delete Task</span>
        </button>
      </div>
      {modalDeleteState.isOpen && (
        <ModalDelete
          closeModal={setModalDeleteVisibility(false)}
          title={modalDeleteState.title}
          description={modalDeleteState.description}
          onDelete={deleteCardHandler}
        />
      )}
    </>
  );
}
