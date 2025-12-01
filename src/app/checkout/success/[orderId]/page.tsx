import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const supabase = await createClient();
  const { orderId } = await params;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        product_name,
        unit_type
      ),
      payment_method:payment_methods (
        name,
        type,
        instructions,
        account_username
      )
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
          <Link 
            href="/products" 
            className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">Thank you for your order</p>
        <p className="text-sm text-gray-500">Order #{order.order_number}</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Order Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {order.status}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.shipping_address_line1}
                {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}
                <br />
                {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment Instructions</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-900 mb-4">
            Please complete payment using <strong>{order.payment_method?.name}</strong>
          </p>

          {order.payment_method?.account_username && (
            <div className="mb-4">
              <dt className="text-sm font-medium text-gray-500">Account/Email</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{order.payment_method.account_username}</dd>
            </div>
          )}

          {order.payment_method?.instructions && (
            <div className="mb-4">
              <dt className="text-sm font-medium text-gray-500">Instructions</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.payment_method.instructions}</dd>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Total Amount Due:</strong> {formatCurrency(order.total)}
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Please include your order number ({order.order_number}) in the payment notes.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="px-6 py-4">
          <ul className="divide-y divide-gray-200">
            {order.order_items?.map((item: any) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} {item.unit_type}
                  </p>
                </div>
                <p className="font-medium text-gray-900">{formatCurrency(item.total_price)}</p>
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
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link 
          href="/dashboard/orders" 
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          View All Orders
        </Link>
        <Link 
          href="/products" 
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
