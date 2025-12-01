'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Orders', path: '/dashboard/orders', icon: '🛒' },
  { name: 'Profile', path: '/dashboard/profile', icon: '👤' },
  { name: 'Addresses', path: '/dashboard/addresses', icon: '📍' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">My Account</h2>
              <nav>
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                            isActive
                              ? 'bg-primary-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
