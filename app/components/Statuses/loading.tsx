import classNames from 'classnames';
import { v4 as uuid } from 'uuid';

import styles from './Statuses.module.css';

const FAKE_STATUSES = Array.from(Array(8).keys()).map(() => {
  const randomNumber = Math.floor(Math.random() * (6 - 1) + 1);

  return {
    id: uuid(),
    cards: Array.from(Array(randomNumber).keys()).map(() => {
      const randomBoolean = Math.random() < 0.5;

      return {
        id: uuid(),
        showAttachments: randomBoolean,
      };
    }),
  };
});

export default function StatusesLoading() {
  return (
    <div className={styles.container}>
      {FAKE_STATUSES.map((item) => {
        return (
          <div className={styles.loadingColumn} key={item.id}>
            <div className={styles.loadingHeader}>
              <span className="formItemSkeleton" />
            </div>
            <div className={styles.loadingCardsWrapper}>
              {item.cards.map((cardItem) => {
                return (
                  <div className={styles.loadingCard} key={cardItem.id}>
                    {cardItem.showAttachments && (
                      <div className={styles.loadingImageWrapper}>
                        <span className={classNames('formItemSkeleton', styles.loadingHeader)} />
                      </div>
                    )}
                    <span className={classNames('formItemSkeleton', styles.loadingTitle)} />
                    <span className={classNames('formItemSkeleton', styles.loadingTags)} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
