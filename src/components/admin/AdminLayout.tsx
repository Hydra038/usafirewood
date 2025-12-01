import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
