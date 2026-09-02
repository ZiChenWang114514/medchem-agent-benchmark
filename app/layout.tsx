import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MedChem Agent Benchmark | Medicinal Chemistry AI Data',
  description: '500 expert-curated medicinal chemistry task sets for AI training, reinforcement learning, private evaluation, and scientific-agent testing.',
  openGraph: { title: 'MedChem Agent Benchmark', description: '500 medicinal chemistry task sets · approximately 2,000 tasks · approximately 10,000 expert rubric entries.', type: 'website' },
  twitter: { card: 'summary', title: 'MedChem Agent Benchmark', description: 'Expert-curated medicinal chemistry reasoning data for scientific AI.' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
