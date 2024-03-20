'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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

  const { formatMessage } = useIntl();

  const router = useRouter();

  const [modalDeleteState, setModalDeleteState] = useState({
    isOpen: false,
    title: formatMessage({ id: 'card.delete' }),
    description: formatMessage({ id: 'card.deleteQuestion' }),
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
      <button className={styles.button} onClick={setModalDeleteVisibility(true)}>
        <span>
          <FormattedMessage id="card.delete" />
        </span>
      </button>
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
