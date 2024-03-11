import { redirect } from 'next/navigation';
import path from 'ramda/es/path';

import Statuses from '@/app/components/Statuses';

import fetchBoards from '../api/board/fetchBoards';

export default async function BoardPage() {
  const boards = await fetchBoards();

  const id = path(['0', 'id'], boards);

  if (id) {
    redirect(`/boards/${id}`);
  }

  return (
    <div className="cards-wrapper">
      <Statuses />
    </div>
  );
}
