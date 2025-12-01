import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wood-900 text-wood-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-base mb-3">Firewood USA</h3>
            <p className="text-xs leading-relaxed">
              Premium firewood delivered to your door. Seasoned, kiln-dried, and heat-treated for
              the perfect fire.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Customer Service</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/shipping" className="hover:text-white transition inline-block py-0.5">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition inline-block py-0.5">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition inline-block py-0.5">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition inline-block py-0.5">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wood-700 mt-6 pt-6 text-center text-xs">
          <p>&copy; {currentYear} Firewood USA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
