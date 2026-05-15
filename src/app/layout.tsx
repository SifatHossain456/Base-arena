import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Base Arena | Compete. Predict. Win on Base.',
  description:
    'Base Arena is the ultimate on-chain competitive prediction platform built on Base mainnet. Battle traders, predict prices, earn rewards and NFT trophies.',
  keywords: ['Base', 'Base Arena', 'DeFi', 'Prediction Market', 'On-chain', 'Coinbase', 'Ethereum'],
  openGraph: {
    title: 'Base Arena',
    description: 'Compete. Predict. Win on Base.',
    siteName: 'Base Arena',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Arena',
    description: 'Compete. Predict. Win on Base.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
