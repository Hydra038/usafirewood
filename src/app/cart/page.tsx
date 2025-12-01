import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCart } from '@/app/actions/cart';
import { formatCurrency } from '@/lib/utils';
import CartItem from './CartItem';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

export default async function CartPage() {
  const cart = await getCart();

  console.log('Cart page - cart data:', cart);
  console.log('Cart page - items:', cart?.items);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some premium firewood to your cart to get started!
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.items.reduce((total: number, item: any) => {
    return total + item.quantity * item.price_at_add;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.items.map((item: any) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Estimated Total</span>
                  <span className="text-primary-600">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 rounded-lg font-semibold transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center text-primary-600 hover:text-primary-700 py-3 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
