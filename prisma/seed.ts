import type { Status } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import * as R from 'ramda';

import { STATUSES, STATUSES_OBJ, TAGS } from '../app/constants';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  // Functions
  const getCardsCountByStatusIdSql = fs
    .readFileSync(
      path.join(process.cwd(), '/app/utils/db/functions/get_cards_count_by_status_id.sql'),
    )
    .toString();
  await prisma.$queryRawUnsafe(getCardsCountByStatusIdSql);

  const getHasMoreCardsByStatusId = fs
    .readFileSync(
      path.join(process.cwd(), '/app/utils/db/functions/get_has_more_cards_by_status_id.sql'),
    )
    .toString();
  await prisma.$queryRawUnsafe(getHasMoreCardsByStatusId);

  const getCardsByStatusId = fs
    .readFileSync(path.join(process.cwd(), '/app/utils/db/functions/get_cards_by_status_id.sql'))
    .toString();
  await prisma.$queryRawUnsafe(getCardsByStatusId);

  const updateCardUpdatedAtSql = fs
    .readFileSync(path.join(process.cwd(), '/app/utils/db/functions/update_card_updated_at.sql'))
    .toString();
  await prisma.$queryRawUnsafe(updateCardUpdatedAtSql);

  const triggerUpdateCardUpdatedAtSql = fs
    .readFileSync(
      path.join(process.cwd(), '/app/utils/db/functions/trigger_update_card_updated_at.sql'),
    )
    .toString();
  await prisma.$queryRawUnsafe(triggerUpdateCardUpdatedAtSql);

  const insertIntoCardStatusHistorySql = fs
    .readFileSync(
      path.join(process.cwd(), '/app/utils/db/functions/insert_into_card_status_history.sql'),
    )
    .toString();
  await prisma.$queryRawUnsafe(insertIntoCardStatusHistorySql);

  const cardInsertTriggerSql = fs
    .readFileSync(path.join(process.cwd(), '/app/utils/db/functions/card_insert_trigger.sql'))
    .toString();
  await prisma.$queryRawUnsafe(cardInsertTriggerSql);

  // Init boards
  await prisma.board.createMany({
    data: [
      { name: 'Home board', protected: true },
      // { name: 'Design board', protected: false },
      // { name: 'Learning board', protected: false },
    ],
  });

  // Init cards
  const boards = await prisma.board.findMany();
  for (const board of boards) {
    // Init statuses
    await prisma.status.createMany({
      data: [
        {
          name: STATUSES.backlog,
          boardId: board.id,
          position: 1,
          color: STATUSES_OBJ[STATUSES.backlog].color,
        },
        {
          name: STATUSES.inReview,
          boardId: board.id,
          position: 2,
          color: STATUSES_OBJ[STATUSES.inReview].color,
        },
        {
          name: STATUSES.inProgress,
          boardId: board.id,
          position: 3,
          color: STATUSES_OBJ[STATUSES.inProgress].color,
        },
        {
          name: STATUSES.completed,
          boardId: board.id,
          position: 4,
          color: STATUSES_OBJ[STATUSES.completed].color,
        },
      ],
    });

    // Init tags
    await prisma.tag.createMany({
      data: [
        {
          name: TAGS.concept.name,
          color: TAGS.concept.color,
          fontColor: TAGS.concept.fontColor,
          boardId: board.id,
        },
        {
          name: TAGS.design.name,
          color: TAGS.design.color,
          fontColor: TAGS.design.fontColor,
          boardId: board.id,
        },
        {
          name: TAGS.frontEnd.name,
          color: TAGS.frontEnd.color,
          fontColor: TAGS.frontEnd.fontColor,
          boardId: board.id,
        },
        {
          name: TAGS.technical.name,
          color: TAGS.technical.color,
          fontColor: TAGS.technical.fontColor,
          boardId: board.id,
        },
      ],
    });

    const statuses = await prisma.status.findMany();
    const grouped = R.indexBy(R.prop('name'), statuses) as Record<string, Status>;

    if (board.name === 'Home board') {
      await prisma.card.create({
        data: {
          // title: 'Investigate Framer-Motion for animations.',
          title: '1',
          boardId: board.id,
          statusId: grouped[STATUSES.backlog].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Implement CRUD operations',
          title: '2',
          boardId: board.id,
          statusId: grouped[STATUSES.backlog].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Implement the ability for users to edit tasks',
          title: '3',
          boardId: board.id,
          statusId: grouped[STATUSES.inProgress].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Implement the ability for users to view a specific subset of tasks',
          title: '4',
          boardId: board.id,
          statusId: grouped[STATUSES.inProgress].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Use the useEffect hook to update the number of pending tasks',
          title: '5',
          boardId: board.id,
          statusId: grouped[STATUSES.inProgress].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Implement the ability for users to delete tasks using the mouse or keyboard',
          title: '6',
          boardId: board.id,
          statusId: grouped[STATUSES.inReview].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Implement the ability for users to add tasks using the mouse or keyboard',
          title: '7',
          boardId: board.id,
          statusId: grouped[STATUSES.inReview].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Create a basic App component structure and styling',
          title: '8',
          boardId: board.id,
          statusId: grouped[STATUSES.completed].id,
        },
      });
      await prisma.card.create({
        data: {
          // title: 'Implement a layout according to the design',
          title: '9',
          boardId: board.id,
          statusId: grouped[STATUSES.completed].id,
        },
      });
    }
  }

  // Init tag linkers
  const cards = await prisma.card.findMany();
  for (const card of cards) {
    const tags = await prisma.tag.findMany({
      where: {
        boardId: card.boardId,
      },
      select: {
        id: true,
      },
    });

    const number = Math.floor(Math.random() * (4 - 1) + 1);
    const data: any = R.cond([
      [
        R.equals(1),
        R.always([
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[0].id,
          },
        ]),
      ],
      [
        R.equals(2),
        R.always([
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[0].id,
          },
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[1].id,
          },
        ]),
      ],
      [
        R.equals(3),
        R.always([
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[0].id,
          },
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[1].id,
          },
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[2].id,
          },
        ]),
      ],
      [
        R.T,
        R.always([
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[0].id,
          },
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[1].id,
          },
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[2].id,
          },
          {
            cardId: card.id,
            boardId: card.boardId,
            tagId: tags[3].id,
          },
        ]),
      ],
    ])(number);

    await prisma.tagLinker.createMany({
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

    await prisma.attachment.create({
      data: {
        name: `name ${i + 1}`,
        url: images[i],
        cardId: card.id,
        position: i + 1,
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
