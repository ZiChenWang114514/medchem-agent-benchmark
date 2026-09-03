import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MedChem Agent Benchmark | Expert Medicinal Chemistry Data for Scientific AI',
  description: '500 expert-written medicinal chemistry task sets — ~2,000 connected tasks and ~10,000 rubric entries grounded in real drug-discovery evidence. Built for model training, reinforcement learning, and private evaluation of scientific agents.',
  openGraph: { title: 'MedChem Agent Benchmark', description: '500 expert-written task sets · ~2,000 connected tasks · ~10,000 rubric entries — real drug-discovery problems for scientific AI agents.', type: 'website' },
  twitter: { card: 'summary', title: 'MedChem Agent Benchmark', description: 'Real drug-discovery problems, built to train and test scientific agents.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
