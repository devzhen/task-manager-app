import { useState } from 'react';
import { SketchPicker } from 'react-color';
import Modal from 'react-modal';

import styles from './ModalColor.module.css';

type ModalColorProps = {
  initialColor: string | undefined;
  closeModal: () => void;
  onSubmit: (hex: string) => void;
};

export default function ModalColor(props: ModalColorProps) {
  const { onSubmit, closeModal, initialColor = '#000000' } = props;

  const [color, setColor] = useState<string | undefined>(initialColor);

  const getContrast = (hex: string | undefined) => {
    if (!hex) {
      return '#000';
    }

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? '#000' : '#fff';
  };

  const onClickHandler = () => {
    if (color) {
      onSubmit(color);
    }
  };

  return (
    <Modal isOpen>
      <div className={styles.container}>
        <SketchPicker color={color} onChange={({ hex }) => setColor(hex)} />
        <div className={styles.footer}>
          <button
            className={styles.button}
            style={{ backgroundColor: color }}
            disabled={!color}
            onClick={onClickHandler}
          >
            <span style={{ color: getContrast(color) }}>{color ? 'Submit' : 'Choose a color'}</span>
          </button>
          <button className={styles.button} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
