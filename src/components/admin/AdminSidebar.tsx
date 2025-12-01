'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Products', path: '/admin/products', icon: '📦' },
  { name: 'Orders', path: '/admin/orders', icon: '🛒' },
  { name: 'Payment Methods', path: '/admin/payment-methods', icon: '💳' },
  { name: 'Users', path: '/admin/users', icon: '👥' },
  { name: 'Categories', path: '/admin/categories', icon: '📁' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-wood-900 text-white w-64 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-wood-300 text-sm">Firewood USA</p>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-wood-800 text-wood-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8 pt-8 border-t border-wood-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-wood-800 text-wood-100 transition"
        >
          <span className="text-xl">🏠</span>
          <span>Back to Store</span>
        </Link>
      </div>
    </aside>
  );
}
