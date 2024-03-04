import { BOARDS } from '@/app/constants';

export const GET = async () => {
  const boards = Object.values(BOARDS).map((item) => ({
    ...item,
    href: `/boards/${item.name.toLowerCase().split(' ').join('-')}`,
  }));

  return Response.json(boards);
};
