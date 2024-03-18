import type { TagLinkerType } from '@/app/types';

import styles from './Tags.module.css';

type TagsProps = {
  tags: TagLinkerType[];
};

export default function Tags(props: TagsProps) {
  const { tags } = props;

  return (
    <div className={styles.container}>
      {tags.map((tag) => {
        return (
          <div className={styles.tag} key={tag.id} style={{ backgroundColor: tag.color }}>
            <span className={styles.tagName} style={{ color: tag.fontColor }}>
              {tag.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
