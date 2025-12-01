import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        product_name,
        unit_type,
        wood_type,
        is_heat_treated
      ),
      payment_method:payment_methods (
        name,
        type,
        instructions,
        account_username
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
            <p className="mt-2 text-gray-600">This order doesn't exist or you don't have access to it.</p>
            <Link
              href="/dashboard/orders"
              className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/orders"
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex gap-3">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : order.payment_status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                Payment: {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="px-6 py-4">
                <ul className="divide-y divide-gray-200">
                  {order.order_items?.map((item: any) => (
                    <li key={item.id} className="py-4 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                        <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                          <p>Wood Type: {item.wood_type}</p>
                          <p>Quantity: {item.quantity} {item.unit_type}</p>
                          {item.is_heat_treated && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Heat Treated
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-500">
                          {formatCurrency(item.unit_price)} × {item.quantity}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.total_price)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-900">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-900">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(order.delivery_fee || 0)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm text-gray-900">
                      <span>Tax</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
              </div>
              <div className="px-6 py-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.shipping_address_line1}
                      {order.shipping_address_line2 && (
                        <>
                          <br />
                          {order.shipping_address_line2}
                        </>
                      )}
                      <br />
                      {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Delivery Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{order.delivery_type}</dd>
                  </div>
                  {order.customer_notes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Delivery Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.customer_notes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.payment_method?.name}</dd>
                </div>
                
                {order.payment_status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                      Payment Instructions
                    </h4>
                    {order.payment_method?.account_username && (
                      <div className="mb-2">
                        <p className="text-xs text-yellow-800">Send payment to:</p>
                        <p className="text-sm font-mono bg-white px-2 py-1 rounded border border-yellow-200 text-yellow-900 mt-1">
                          {order.payment_method.account_username}
                        </p>
                      </div>
                    )}
                    {order.payment_method?.instructions && (
                      <p className="text-xs text-yellow-800 mb-2">
                        {order.payment_method.instructions}
                      </p>
                    )}
                    <p className="text-xs text-yellow-800 font-semibold">
                      Include order number: {order.order_number}
                    </p>
                  </div>
                )}

                {order.payment_status === 'paid' && order.paid_at && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✓ Payment received on {formatDate(order.paid_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer_email}</dd>
                </div>
                {order.customer_phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.customer_phone}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            {(order.paid_at || order.shipped_at || order.delivered_at || order.cancelled_at) && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
                </div>
                <div className="px-6 py-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-400"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Order Placed</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                    </li>
                    {order.paid_at && (
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Payment Received</p>
                          <p className="text-xs text-gray-500">{formatDate(order.paid_at)}</p>
                        </div>
                      </li>
                    )}
                    {order.shipped_at && (
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Shipped</p>
                          <p className="text-xs text-gray-500">{formatDate(order.shipped_at)}</p>
                        </div>
                      </li>
                    )}
                    {order.delivered_at && (
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Delivered</p>
                          <p className="text-xs text-gray-500">{formatDate(order.delivered_at)}</p>
                        </div>
                      </li>
                    )}
                    {order.cancelled_at && (
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Cancelled</p>
                          <p className="text-xs text-gray-500">{formatDate(order.cancelled_at)}</p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
