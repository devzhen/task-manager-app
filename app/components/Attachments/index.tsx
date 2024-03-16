import Image from 'next/image';
import { indexBy, prop, remove } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { UseControllerProps, useController, UseFormSetValue } from 'react-hook-form';
import Modal from 'react-modal';
import Sortable from 'sortablejs';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { TASK_ATTACHMENT_MAX_SIZE } from '@/app/constants';
import type { AddCardFormInputs, FormAttachment } from '@/app/types';

import ModalInfo from '../ModalInfo';

import styles from './Attachments.module.css';

type AttachmentsProps = UseControllerProps<AddCardFormInputs> & {
  setValue: UseFormSetValue<AddCardFormInputs>;
};

export default function Attachments(props: AttachmentsProps) {
  const { setValue } = props;

  const attachmentsContainerRef = useRef<HTMLDivElement | null>(null);

  const state = useController(props);
  const attachments = state.field.value as AddCardFormInputs['attachments'];
  const attachmentsRef = useRef(indexBy(prop('id'), attachments));

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: 'Error',
    description: '',
  });

  const [lightBoxState, setLightBoxState] = useState({
    isOpen: false,
    src: '',
  });

  /**
   * Set modal visibility
   */
  const setModalAddVisibility = (isVisible: boolean) => () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: isVisible,
    }));
  };

  /**
   * Set modal visibility
   */
  const setLightBoxVisibility =
    (isVisible: boolean, src: string = '') =>
    () => {
      setLightBoxState({
        src,
        isOpen: isVisible,
      });
    };

  /**
   * On drop handler
   */
  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        description: `${fileRejections.length > 1 ? `${fileRejections.length} files` : 'The file'} failed to upload due to format or size restrictions.`,
      }));
    }

    const files = acceptedFiles as FormAttachment[];

    const newAttachments = [...attachments];

    for (const file of files) {
      const src = URL.createObjectURL(file);
      file.id = src;
      file.url = src;
      file.position = attachments.length;
      newAttachments.push(file);
    }

    setValue('attachments', newAttachments);
  };

  /**
   * On a attachment delete
   */
  const onDelete = (id: string) => () => {
    const index = attachments.findIndex((item) => item.id === id);
    if (index !== -1) {
      const item = attachments[index];

      URL.revokeObjectURL(item.url);

      setValue('attachments', remove(index, 1, attachments));
    }
  };

  /**
   * On attachment click
   */
  const onAttachmentClick = (attachment: FormAttachment) => () => {
    setLightBoxState({
      src: attachment.url,
      isOpen: true,
    });
  };

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: TASK_ATTACHMENT_MAX_SIZE,
  });

  useEffect(() => {
    attachmentsRef.current = indexBy(prop('id'), attachments);
  }, [attachments]);

  useEffect(() => {
    Modal.setAppElement('.container');

    Sortable.create(attachmentsContainerRef.current as HTMLDivElement, {
      filter: `.${styles.dropZone}`,
      onMove(event) {
        return event.related.className.indexOf(styles.dropZone) === -1;
      },
      onChange: () => {
        const attachmentsElements =
          attachmentsContainerRef.current?.querySelectorAll('[data-role="attachment"]') || [];

        for (let i = 0; i < attachmentsElements.length; i++) {
          const element = attachmentsElements[i];

          const id = element.getAttribute('data-id');

          attachmentsRef.current[id as string].position = i + 1;
        }

        const newAttachments = Object.values(attachmentsRef.current).sort(
          (a, b) => a.position - b.position,
        );

        setValue('attachments', newAttachments);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>Attachments:</p>
        <p>Only PNG and JPG image formats are permitted, and file sizes must not exceed 4.5 MB.</p>
      </div>
      <div className={styles.attachments} ref={attachmentsContainerRef}>
        <div {...getRootProps({ className: styles.dropZone })}>
          <input {...getInputProps()} />
          <span>{`Drag 'n' drop some files here, or click to select files`}</span>
        </div>
        {attachments.map((attachment, index) => {
          return (
            <div
              className={styles.fileContainer}
              key={attachment.url}
              data-id={attachment.id}
              data-role="attachment"
              data-position={index + 1}
              role="presentation"
              onClick={onAttachmentClick(attachment)}
            >
              <div className={styles.imageWrapper}>
                <div className={styles.imageLoaderWrapper}>
                  <div className="loader" />
                </div>
                <Image
                  src={attachment.url}
                  alt="Img"
                  fill
                  sizes="100%"
                  style={{
                    objectFit: 'cover',
                  }}
                  priority
                  draggable={false}
                />
              </div>
              <div className={styles.deleteWrapper}>
                <Image
                  alt="Img"
                  src="/delete.svg"
                  width={18}
                  height={18}
                  onClick={onDelete(attachment.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
      {lightBoxState.isOpen && (
        <Lightbox
          open={lightBoxState.isOpen}
          close={setLightBoxVisibility(false)}
          slides={[{ src: lightBoxState.src }]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
        />
      )}
      {modalState.isOpen && (
        <ModalInfo
          isOpen={modalState.isOpen}
          closeModal={setModalAddVisibility(false)}
          title={modalState.title}
          description={modalState.description}
        />
      )}
    </div>
  );
}
