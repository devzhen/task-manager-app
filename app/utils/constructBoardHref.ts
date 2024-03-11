import ramdaClone from 'ramda/src/clone';

import { BoardType } from '../types';

const constructBoardHref = (board: BoardType) => {
  const clone = ramdaClone(board);

  (clone.href as string) = `/boards/${clone.name.toLowerCase().split(' ').join('-')}`;

  return clone;
};

export default constructBoardHref;
