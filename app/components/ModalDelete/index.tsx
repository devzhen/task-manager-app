import Image from 'next/image';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';

import styles from './ModalDelete.module.css';

type ModalDeleteProps = {
  closeModal: () => void;
  onDelete: () => void;
  title: string;
  description: string;
  deleteBtnText?: string;
  cancelBtnText?: string;
};

export default function ModalDelete(props: ModalDeleteProps) {
  const {
    closeModal,
    title,
    description,
    onDelete,
    deleteBtnText = 'delete',
    cancelBtnText = 'cancel',
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal isOpen>
      <div className={styles.header}>
        <span>{title}</span>
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
        <span>{description}</span>
      </div>
      <div className={styles.footer}>
        <button
          onClick={() => {
            setIsLoading(true);
            onDelete();
          }}
        >
          {!isLoading && (
            <span>
              <FormattedMessage id={deleteBtnText} />
            </span>
          )}
          {isLoading && <div className="loader" />}
        </button>
        <button onClick={closeModal}>
          <FormattedMessage id={cancelBtnText} />
        </button>
      </div>
    </Modal>
  );
}
