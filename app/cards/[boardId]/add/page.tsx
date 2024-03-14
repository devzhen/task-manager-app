import AddCardForm from '@/app/components/AddCardForm';

import styles from './page.module.css';

type AddPageProps = {
  params: {
    boardId: string;
  };
};

export default async function AddPage(props: AddPageProps) {
  const {
    params: { boardId },
  } = props;

  // Fetch statuses by board
  // Fetch tags by board

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AddCardForm
          statuses={[
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' },
          ]}
          tags={[
            { value: 'inProgress', label: 'In Progress' },
            { value: 'inReview', label: 'In Review' },
            { value: 'completed', label: 'Completed' },
            { value: 'backlog', label: 'Backlog' },
          ]}
        />
      </div>
    </div>
  );
}
