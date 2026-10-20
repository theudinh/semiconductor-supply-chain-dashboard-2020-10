import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Semiconductor Supply-Chain Explorer',
  description: 'Explore entities and supplier/customer relationships in a semiconductor supply-chain network.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">Semiconductor Supply-Chain Explorer</Link>
          <nav aria-label="Main navigation">
            <Link href="/top-1000">Top 1,000</Link>
            <Link href="/search">Search entities</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">Supply-chain network explorer</footer>
      </body>
    </html>
  );
}
