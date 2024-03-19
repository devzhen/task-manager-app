import { redirect } from 'next/navigation';
import path from 'ramda/es/path';

import fetchBoards from '../../api/board/fetchBoards';

export default async function BoardPage() {
  const boards = await fetchBoards();

  const id = path(['0', 'id'], boards);

  redirect(`/boards/${id}`);
}
