import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MedChem Agent Benchmark | Expert Medicinal Chemistry Data for Scientific AI',
  description: 'A medicinal chemistry benchmark program designed for 500 task sets and ~2,000 connected tasks, with Pilot20 results from 14 evaluated systems.',
  openGraph: { title: 'MedChem Agent Benchmark', description: 'A 500-set benchmark design · ~2,000 connected tasks · Pilot20 results from 14 evaluated systems.', type: 'website' },
  twitter: { card: 'summary', title: 'MedChem Agent Benchmark', description: 'Real drug-discovery problems, built to train and test scientific agents.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
