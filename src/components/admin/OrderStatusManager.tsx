'use client';

import { useState } from 'react';
import { updateOrderStatus, updatePaymentStatus } from '@/app/actions/admin';

interface OrderStatusManagerProps {
  orderId: string;
  currentOrderStatus: string;
  currentPaymentStatus: string;
}

export default function OrderStatusManager({
  orderId,
  currentOrderStatus,
  currentPaymentStatus,
}: OrderStatusManagerProps) {
  const [orderStatus, setOrderStatus] = useState(currentOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const handleOrderStatusChange = async (newStatus: string) => {
    if (!confirm(`Change order status to "${newStatus}"?`)) return;

    setIsUpdatingOrder(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus as any);
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setOrderStatus(newStatus);
        alert('Order status updated successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update order status');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    if (!confirm(`Change payment status to "${newStatus}"?`)) return;

    setIsUpdatingPayment(true);
    try {
      const result = await updatePaymentStatus(orderId, newStatus as any);
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setPaymentStatus(newStatus);
        alert('Payment status updated successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Payment status update error:', error);
      alert('Failed to update payment status');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Order Status</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                orderStatus === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : orderStatus === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : orderStatus === 'processing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : orderStatus === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {orderStatus}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Change Status</p>
            <div className="space-y-2">
              <button
                onClick={() => handleOrderStatusChange('pending')}
                disabled={isUpdatingOrder || orderStatus === 'pending'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold">Pending</span>
                <p className="text-xs text-gray-600">Order received, awaiting processing</p>
              </button>

              <button
                onClick={() => handleOrderStatusChange('processing')}
                disabled={isUpdatingOrder || orderStatus === 'processing'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-yellow-700">Processing</span>
                <p className="text-xs text-gray-600">Order is being prepared</p>
              </button>

              <button
                onClick={() => handleOrderStatusChange('shipped')}
                disabled={isUpdatingOrder || orderStatus === 'shipped'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-blue-700">Shipped</span>
                <p className="text-xs text-gray-600">Order is on the way</p>
              </button>

              <button
                onClick={() => handleOrderStatusChange('delivered')}
                disabled={isUpdatingOrder || orderStatus === 'delivered'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-green-700">Delivered</span>
                <p className="text-xs text-gray-600">Order has been delivered</p>
              </button>

              <button
                onClick={() => handleOrderStatusChange('cancelled')}
                disabled={isUpdatingOrder || orderStatus === 'cancelled'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-red-700">Cancelled</span>
                <p className="text-xs text-gray-600">Order has been cancelled</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Payment Status</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {paymentStatus}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Change Status</p>
            <div className="space-y-2">
              <button
                onClick={() => handlePaymentStatusChange('pending')}
                disabled={isUpdatingPayment || paymentStatus === 'pending'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-yellow-700">Pending</span>
                <p className="text-xs text-gray-600">Awaiting payment confirmation</p>
              </button>

              <button
                onClick={() => handlePaymentStatusChange('paid')}
                disabled={isUpdatingPayment || paymentStatus === 'paid'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-green-700">Paid</span>
                <p className="text-xs text-gray-600">Payment received and confirmed</p>
              </button>

              <button
                onClick={() => handlePaymentStatusChange('failed')}
                disabled={isUpdatingPayment || paymentStatus === 'failed'}
                className="w-full px-4 py-2 text-left rounded-lg border-2 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <span className="font-semibold text-red-700">Failed</span>
                <p className="text-xs text-gray-600">Payment was unsuccessful</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
