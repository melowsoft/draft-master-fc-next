import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Layout from '../components/Layout';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DraftMaster FC | UK's #1 Football Squad Builder | Lineup",
    template: '%s | DraftMaster FC',
  },
  description:
    'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad or lineup builder for Premier League, EFL, and classic fans.',
  keywords: [
    'Create your team formations',
    'lineup maker uk',
    'Football Formation Creator',
    'premier league draft app',
    'lineup builder',
    'Make Your Team and Share Tactics'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DraftMaster FC | UK's #1 Football Squad Builder | Lineup",
    description:
      'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad or lineup builder for Premier League, EFL, and classic fans.',
    url: siteUrl,
    siteName: 'DraftMaster FC',
    locale: 'en_GB',
    type: 'website',
     images: [
  {
    url: `${siteUrl}/og-image.png`, // Absolute URL
    width: 1200,
    height: 630,
    alt: "DraftMaster FC",
  },
],
  },
  twitter: {
    card: 'summary_large_image',
    title: "DraftMaster FC | UK's #1 Football Squad Builder | Lineup",
    description:
      'Build your perfect Starting XI with DraftMaster FC. The ultimate football squad or lineup builder for Premier League, EFL, and classic fans.',
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
  icons: {
    icon: `${siteUrl}/icon.png`,
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
