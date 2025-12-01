import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Firewood USA - Premium Firewood Delivery',
    template: '%s | Firewood USA',
  },
  description:
    'Premium seasoned and kiln-dried firewood delivered to your door. Oak, cherry, maple, and more. Heat-treated and ready to burn.',
  keywords: [
    'firewood',
    'firewood delivery',
    'seasoned firewood',
    'kiln-dried firewood',
    'oak firewood',
    'cherry firewood',
    'maple firewood',
  ],
  authors: [{ name: 'Firewood USA' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png' },
    ],
    apple: '/apple-icon',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Firewood USA',
    title: 'Firewood USA - Premium Firewood Delivery',
    description: 'Premium seasoned and kiln-dried firewood delivered to your door',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
