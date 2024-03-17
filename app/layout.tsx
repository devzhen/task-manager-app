import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';

import fetchBoards from './api/board/fetchBoards';
import ContentWrapper from './components/ContentWrapper';
import Footer from './components/Footer';
import Header from './components/Header';
import SideBar from './components/SideBar';
import type { BoardType } from './types';

export const metadata: Metadata = {
  title: 'Task Manager App',
  description: 'Task manager application',
};

const font = Roboto({
  subsets: ['latin'],
  weight: '400',
  fallback: ['Times New Roman'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const boards: BoardType[] = await fetchBoards();

  return (
    <html lang="en">
      <body className={font.className}>
        <div className="container">
          <Header />
          <ContentWrapper>
            <SideBar boards={boards} />
            {children}
          </ContentWrapper>
          <Footer />
        </div>
      </body>
    </html>
  );
}
