import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';

import ContentWrapper from './components/ContentWrapper';
import Footer from './components/Footer';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'Task Manager App',
  description: 'Task manager application',
};

const font = Roboto({
  subsets: ['latin'],
  weight: '400',
  fallback: ['Times New Roman'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="container">
          <Header />
          <ContentWrapper>{children}</ContentWrapper>
          <Footer />
        </div>
      </body>
    </html>
  );
}
