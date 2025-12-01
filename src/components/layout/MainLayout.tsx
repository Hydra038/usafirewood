import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
