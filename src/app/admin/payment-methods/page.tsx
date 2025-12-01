import { getPaymentMethodsAdmin } from '@/app/actions/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import PaymentMethodToggle from '@/components/admin/PaymentMethodToggle';
import Link from 'next/link';

export default async function AdminPaymentMethodsPage() {
  const paymentMethods = await getPaymentMethodsAdmin();

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <Link
            href="/admin/payment-methods/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            + Add Payment Method
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account/Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visible to Clients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paymentMethods.map((method: any) => (
                <tr key={method.id}>
                  <td className="px-6 py-4 font-semibold">{method.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {method.account_username || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        method.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {method.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <PaymentMethodToggle
                        methodId={method.id}
                        isActive={method.is_active}
                        methodName={method.name}
                      />
                      <span className="text-sm text-gray-600">
                        {method.is_active ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{method.display_order}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/payment-methods/${method.id}/edit`}
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
