import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Layout from '../components/Layout';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "DraftMaster FC | UK's #1 Football Squad Builder",
  description:
    'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad builder for Premier League, EFL, and classic fans.',
  keywords: [
    'football squad builder',
    'lineup maker uk',
    'premier league draft app',
    'fantasy football tactics',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

