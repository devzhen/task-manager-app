import type { BoardType, CardType } from '@/app/types';

export const createInitialFormValues = ({
  board,
  card,
}: {
  board: BoardType;
  card: CardType | undefined;
}) => {
  const title = card ? card.title : '';
  const description = card && typeof card.description === 'string' ? card.description : '';
  const status = card ? card.status : board.statuses[0];
  const tags = card
    ? card.tags.map((item) => ({
        ...item,
        id: item.tag?.id as string,
        label: item.tag?.name as string,
        color: item.tag?.color as string,
        fontColor: item.tag?.fontColor as string,
        value: item.tagId,
      }))
    : [];
  const attachments = card
    ? card.attachments.map((item) => {
        return {
          ...item,
          fromDB: true,
        };
      })
    : [];

  return {
    title,
    description,
    status: { ...status, label: status.name, value: status.id },
    tags,
    attachments,
  };
};
