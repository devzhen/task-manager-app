import { PrismaClient, Statuses } from '@prisma/client';
import * as R from 'ramda';

import { STATUSES, TAGS } from '../app/constants';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  // Init boards
  await prisma.boards.createMany({
    data: [
      { name: 'Home board', protected: true },
      { name: 'Design board', protected: false },
      { name: 'Learning board', protected: false },
    ],
  });

  // Init cards
  const boards = await prisma.boards.findMany();
  for (const board of boards) {
    await prisma.statuses.createMany({
      data: [
        { name: STATUSES.backlog, boardId: board.id },
        { name: STATUSES.inReview, boardId: board.id },
        { name: STATUSES.inProgress, boardId: board.id },
        { name: STATUSES.completed, boardId: board.id },
      ],
    });

    const statuses = await prisma.statuses.findMany();
    const grouped = R.indexBy(R.prop('name'), statuses) as Record<string, Statuses>;

    if (board.name === 'Home board') {
      await prisma.cards.createMany({
        data: [
          {
            title: 'Investigate Framer-Motion for animations.',
            boardId: board.id,
            position: 1,
            statusId: grouped[STATUSES.backlog].id,
          },
          {
            title: 'Implement CRUD operations',
            boardId: board.id,
            position: 2,
            statusId: grouped[STATUSES.backlog].id,
          },
          {
            title: 'Implement the ability for users to edit tasks',
            boardId: board.id,
            position: 1,
            statusId: grouped[STATUSES.inProgress].id,
          },
          {
            title: 'Implement the ability for users to view a specific subset of tasks',
            boardId: board.id,
            position: 2,
            statusId: grouped[STATUSES.inProgress].id,
          },
          {
            title: 'Use the useEffect hook to update the number of pending tasks',
            boardId: board.id,
            position: 3,
            statusId: grouped[STATUSES.inProgress].id,
          },
          {
            title: 'Implement the ability for users to delete tasks using the mouse or keyboard',
            boardId: board.id,
            position: 1,
            statusId: grouped[STATUSES.inReview].id,
          },
          {
            title: 'Implement the ability for users to add tasks using the mouse or keyboard',
            boardId: board.id,
            position: 2,
            statusId: grouped[STATUSES.inReview].id,
          },
          {
            title: 'Create a basic App component structure and styling',
            boardId: board.id,
            position: 1,
            statusId: grouped[STATUSES.completed].id,
          },
          {
            title: 'Implement a layout according to the design',
            boardId: board.id,
            position: 3,
            statusId: grouped[STATUSES.completed].id,
          },
        ],
      });
    }
  }

  // Init tags
  const cards = await prisma.cards.findMany();
  for (const card of cards) {
    const number = Math.floor(Math.random() * (4 - 1) + 1);
    const data: any = R.cond([
      [
        R.equals(1),
        R.always([
          {
            cardId: card.id,
            name: TAGS.concept.name,
            color: TAGS.concept.color,
            fontColor: TAGS.concept.fontColor,
            boardId: card.boardId,
          },
        ]),
      ],
      [
        R.equals(2),
        R.always([
          {
            cardId: card.id,
            name: TAGS.frontEnd.name,
            color: TAGS.frontEnd.color,
            fontColor: TAGS.frontEnd.fontColor,
            boardId: card.boardId,
          },
          {
            cardId: card.id,
            name: TAGS.technical.name,
            color: TAGS.technical.color,
            fontColor: TAGS.technical.fontColor,
            boardId: card.boardId,
          },
        ]),
      ],
      [
        R.equals(3),
        R.always([
          {
            cardId: card.id,
            name: TAGS.design.name,
            color: TAGS.design.color,
            fontColor: TAGS.design.fontColor,
            boardId: card.boardId,
          },
          {
            cardId: card.id,
            name: TAGS.frontEnd.name,
            color: TAGS.frontEnd.color,
            fontColor: TAGS.frontEnd.fontColor,
            boardId: card.boardId,
          },
          {
            cardId: card.id,
            name: TAGS.technical.name,
            color: TAGS.technical.color,
            fontColor: TAGS.technical.fontColor,
            boardId: card.boardId,
          },
        ]),
      ],
      [
        R.T,
        R.always([
          {
            cardId: card.id,
            name: TAGS.design.name,
            color: TAGS.design.color,
            fontColor: TAGS.design.fontColor,
            boardId: card.boardId,
          },
          {
            cardId: card.id,
            name: TAGS.frontEnd.name,
            color: TAGS.frontEnd.color,
            fontColor: TAGS.frontEnd.fontColor,
            boardId: card.boardId,
          },
          {
            cardId: card.id,
            name: TAGS.technical.name,
            color: TAGS.technical.color,
            fontColor: TAGS.technical.fontColor,
            boardId: card.boardId,
          },
          {
            cardId: card.id,
            name: TAGS.concept.name,
            color: TAGS.concept.color,
            fontColor: TAGS.concept.fontColor,
            boardId: card.boardId,
          },
        ]),
      ],
    ])(number);

    await prisma.tags.createMany({
      data,
    });
  }

  // Init attachments
  const array = Array.from(Array(2).keys());
  const images = [
    'https://5ryohuhemoegbt23.public.blob.vercel-storage.com/code-339Kyq3sDuhcCagesysPjzjIkjr6gZ.png',
    'https://5ryohuhemoegbt23.public.blob.vercel-storage.com/design-54Vj8RZL35bHb2fte6Tj6oiUxuEaPx.png',
  ];
  for (let i = 0; i < array.length; i++) {
    const randomIndex = Math.floor(Math.random() * (cards.length - 1 - 0) + 0);
    const card = cards[randomIndex];

    await prisma.attachments.create({
      data: {
        name: `name ${i + 1}`,
        url: images[i],
        cardId: card.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
