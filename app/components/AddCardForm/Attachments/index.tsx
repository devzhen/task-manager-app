import Image from 'next/image';
import { indexBy, prop, update } from 'ramda';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from 'react-modal';
import Sortable from 'sortablejs';
import { v4 as uuid } from 'uuid';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { TASK_ATTACHMENT_MAX_SIZE } from '@/app/constants';
import type { FormAttachment } from '@/app/types';

import ModalInfo from '../../ModalInfo';
import type { AddCardFormInputs } from '../types';

import styles from './Attachments.module.css';

export default function Attachments() {
  const attachmentsContainerRef = useRef<HTMLDivElement | null>(null);

  const { formatMessage } = useIntl();

  const { setValue, trigger, getValues } = useFormContext<AddCardFormInputs>();

  const { field } = useController<AddCardFormInputs, 'attachments'>({
    name: 'attachments',
  });

  const { fields, append, remove } = useFieldArray<AddCardFormInputs, 'attachments', 'formFieldId'>(
    {
      name: 'attachments',
      keyName: 'formFieldId',
    },
  );

  const attachmentsRef = useRef(indexBy(prop('id'), fields));

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
        description: formatMessage(
          { id: 'attachments.uploadError' },
          { count: fileRejections.length },
        ),
      }));
    }

    const files = acceptedFiles as FormAttachment[];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      append({
        id: uuid(),
        url: URL.createObjectURL(file),
        position: fields.length + i + 1,
        fromDB: false,
        file,
      });
    }

    trigger();

    field.onChange({ target: { value: getValues().attachments } });
  };

  /**
   * On a attachment delete
   */
  const onDelete = (id: string) => (e: MouseEvent) => {
    e.stopPropagation();

    const index = fields.findIndex((item) => item.id === id);
    if (index !== -1) {
      const item = fields[index];

      URL.revokeObjectURL(item.url);

      remove(index);

      const attachments = [...getValues().attachments];
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        attachment.position = i + 1;

        update(i, attachment);
      }

      trigger();

      field.onChange({ target: { value: getValues().attachments } });
    }
  };

  /**
   * On attachment click
   */
  const onAttachmentClick = (attachment: AddCardFormInputs['attachments']['0']) => () => {
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
    attachmentsRef.current = indexBy(prop('id'), fields);
  }, [fields]);

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
        field.onChange({ target: { value: getValues().attachments } });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>
          <FormattedMessage id="attachments" />:
        </p>
        <p>
          <FormattedMessage id="attachments.restriction" />
        </p>
      </div>
      <div className={styles.attachments} ref={attachmentsContainerRef}>
        <div {...getRootProps({ className: styles.dropZone })}>
          <input {...getInputProps()} />
          <span>
            <FormattedMessage id="attachments.message" />
          </span>
        </div>
        {fields.map((attachment, index) => {
          return (
            <div
              className={styles.fileContainer}
              key={attachment.id}
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
              <div
                className={styles.deleteWrapper}
                onClick={onDelete(attachment.id)}
                role="presentation"
              >
                <Image alt="Img" src="/delete.svg" width={18} height={18} />
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
          closeModal={setModalAddVisibility(false)}
          title={modalState.title}
          description={modalState.description}
        />
      )}
    </div>
  );
}
