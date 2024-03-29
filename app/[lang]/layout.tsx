import type { Metadata } from 'next';
// eslint-disable-next-line import/order
import { Roboto } from 'next/font/google';

import '../globals.css';

import type { ReactNode } from 'react';

import AppIntlProvider from '../components/AppIntlProvider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { getDictionary } from '../dictionaries';

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

  return (
    <html lang="en">
      <body className={font.className}>
        <div className="container">
          <AppIntlProvider dictionary={dictionary} locale={lang}>
            <Header />
            {children}
          </AppIntlProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
}
