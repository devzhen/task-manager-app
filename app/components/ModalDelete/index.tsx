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
};

export default function ModalDelete(props: ModalDeleteProps) {
  const { closeModal, title, description, onDelete } = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal isOpen contentLabel="Example Modal">
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
              <FormattedMessage id="delete" />
            </span>
          )}
          {isLoading && <div className="loader" />}
        </button>
        <button onClick={closeModal}>
          <FormattedMessage id="cancel" />
        </button>
      </div>
    </Modal>
  );
}
