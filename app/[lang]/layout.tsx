import type { Metadata } from 'next';
// eslint-disable-next-line import/order
import { Roboto } from 'next/font/google';

import '../globals.css';

import type { ReactNode } from 'react';

import fetchBoards from '../api/board/fetchBoards';
import AppIntlProvider from '../components/AppIntlProvider';
import ContentWrapper from '../components/ContentWrapper';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import { getDictionary } from '../dictionaries';
import type { BoardType } from '../types';

export const metadata: Metadata = {
  title: 'Task Manager App',
  description: 'Task manager application',
};

const font = Roboto({
  subsets: ['latin'],
  weight: '400',
  fallback: ['Times New Roman'],
});

type RootLayoutProps = {
  children: ReactNode;
  params: {
    lang: string;
  };
};

export default async function RootLayout(props: RootLayoutProps) {
  const {
    children,
    params: { lang },
  } = props;

  const dictionary = await getDictionary(lang);

  const boards: BoardType[] = await fetchBoards();

  return (
    <html lang="en">
      <body className={font.className}>
        <div className="container">
          <Header />
          <ContentWrapper>
            <AppIntlProvider dictionary={dictionary} locale={lang}>
              <SideBar boards={boards} />
            </AppIntlProvider>
            {children}
          </ContentWrapper>
          <Footer />
        </div>
      </body>
    </html>
  );
}
