import type { ReactNode } from 'react';

import fetchBoards from '@/app/api/board/fetchBoards';
import ContentWrapper from '@/app/components/ContentWrapper';
import SideBar from '@/app/components/SideBar';
import type { BoardType } from '@/app/types';

type TemplateProps = {
  children: ReactNode;
};

export default async function Template({ children }: TemplateProps) {
  let boards: BoardType[] = await fetchBoards();
  if (boards && 'error' in boards) {
    boards = [];
  }

  return (
    <ContentWrapper>
      <SideBar boards={boards} />
      {children}
    </ContentWrapper>
  );
}
