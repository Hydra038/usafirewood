import { createClient } from '@/lib/supabase/server';
import AdminLayout from '@/components/admin/AdminLayout';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get statistics
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-sm text-gray-600 mb-2">Total Products</div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{productsCount || 0}</div>
            <Link href="/admin/products" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-sm text-gray-600 mb-2">Total Orders</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{ordersCount || 0}</div>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              View All →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-sm text-gray-600 mb-2">Pending Orders</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">{pendingOrders || 0}</div>
            <Link href="/admin/orders?status=pending" className="text-sm text-orange-600 hover:underline mt-2 inline-block">
              Review →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-sm text-gray-600 mb-2">Total Users</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{usersCount || 0}</div>
            <Link href="/admin/users" className="text-sm text-green-600 hover:underline mt-2 inline-block">
              Manage →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/products/new"
              className="block p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-600 hover:bg-primary-50 transition"
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="font-semibold">Add New Product</div>
            </Link>

            <Link
              href="/admin/orders"
              className="block p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-semibold">Process Orders</div>
            </Link>

            <Link
              href="/admin/payment-methods"
              className="block p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-600 hover:bg-green-50 transition"
            >
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold">Payment Methods</div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
