import Image from 'next/image';
import Modal from 'react-modal';

import styles from './ModalInfo.module.css';

type ModalInfoProps = {
  closeModal: () => void;
  title: string;
  description?: string;
};

export default function ModalInfo(props: ModalInfoProps) {
  const { closeModal, title, description } = props;

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
        <button onClick={closeModal}>Cancel</button>
      </div>
    </Modal>
  );
}
