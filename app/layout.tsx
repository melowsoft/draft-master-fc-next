import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Layout from '../components/Layout';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DraftMaster FC | UK's #1 Football Squad Builder",
    template: '%s | DraftMaster FC',
  },
  description:
    'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad builder for Premier League, EFL, and classic fans.',
  keywords: [
    'football squad builder',
    'lineup maker uk',
    'premier league draft app',
    'fantasy football tactics',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DraftMaster FC | UK's #1 Football Squad Builder",
    description:
      'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad builder for Premier League, EFL, and classic fans.',
    url: '/',
    siteName: 'DraftMaster FC',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DraftMaster FC | UK's #1 Football Squad Builder",
    description:
      'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad builder for Premier League, EFL, and classic fans.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
