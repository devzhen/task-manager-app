import { BOARDS } from '@/app/constants';

export const GET = async () => {
  return Response.json(BOARDS);
};
