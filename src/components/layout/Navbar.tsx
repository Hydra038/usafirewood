'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CartCount from './CartCount';
import AuthButton from './AuthButton';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button - LEFT SIDE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo - CENTERED ON MOBILE, LEFT ON DESKTOP */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-wood-800 md:flex-none absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none"
          >
            🔥 Firewood USA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
          </div>

          {/* Right Side - Cart & Account (visible on mobile and desktop) */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-primary-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <CartCount />
            </Link>
            <div className="hidden md:block">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-primary-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="py-2 border-t mt-2 pt-4">
              <AuthButton onAction={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
