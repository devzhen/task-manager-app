import Image from 'next/image';

import styles from './Attachments.module.css';

type AttachmentsProps = {
  files: (File & { src: string })[];
  onDelete: (src: string) => () => void;
};

export default function Attachments(props: AttachmentsProps) {
  const { files, onDelete } = props;

  return (
    <div className={styles.container}>
      {files.map((file) => {
        return (
          <div className={styles.fileContainer} key={file.src}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageLoaderWrapper}>
                <div className="loader" />
              </div>
              <Image
                src={file.src}
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
                onClick={onDelete(file.src)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
