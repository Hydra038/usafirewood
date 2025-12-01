import { getOrderById } from '@/app/actions/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import OrderStatusManager from '@/components/admin/OrderStatusManager';
import CopyUrlButton from '@/components/admin/CopyUrlButton';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default async function AdminOrderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
          <p className="text-gray-600 mt-1">Placed on {formatDate(order.created_at)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <p className="font-semibold">{item.products?.name || 'Product'}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {formatCurrency(item.price_at_purchase)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.quantity * item.price_at_purchase)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  <span>{formatCurrency(order.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{order.customer_phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-semibold">
                  {order.shipping_address_line1}
                  {order.shipping_address_line2 && <>, {order.shipping_address_line2}</>}
                </p>
                <p className="font-semibold">
                  {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                </p>
                {order.customer_notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Customer Notes</p>
                    <p className="text-sm bg-gray-50 p-3 rounded mt-1">{order.customer_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status Manager (Client Component) */}
            <OrderStatusManager
              orderId={order.id}
              currentOrderStatus={order.status}
              currentPaymentStatus={order.payment_status}
            />

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <p className="font-semibold">{order.payment_methods?.name || 'N/A'}</p>
            </div>

            {/* Payment Proof */}
            {order.payment_proof_url && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Payment Proof</h2>
                
                {/* Image Preview */}
                <div className="mb-4">
                  <img
                    src={order.payment_proof_url}
                    alt="Payment proof"
                    className="w-full rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition"
                    onClick={() => window.open(order.payment_proof_url, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Click image to view full size
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <a
                    href={order.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Full Size
                  </a>
                  <a
                    href={order.payment_proof_url}
                    download
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </a>
                  <CopyUrlButton url={order.payment_proof_url} />
                </div>
              </div>
            )}

            {!order.payment_proof_url && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">No Payment Proof</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Customer did not upload payment confirmation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
