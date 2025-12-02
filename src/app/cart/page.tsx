'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit_type: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const localCart = localStorage.getItem('cart');
      if (!localCart) {
        setLoading(false);
        return;
      }

      const cartItems = JSON.parse(localCart);
      const supabase = createClient();
      const productIds = cartItems.map((item: any) => item.productId);
      
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, price, unit_type')
        .in('id', productIds);

      if (productsData) {
        const cartWithDetails = cartItems.map((item: any) => {
          const product = productsData.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            name: product?.name || 'Unknown',
            price: product?.price || 0,
            quantity: item.quantity,
            unit_type: product?.unit_type || 'unit'
          };
        });
        setCart(cartWithDetails);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const cartItems = JSON.parse(localCart);
      const updated = cartItems.map((item: any) => 
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      loadCart();
    }
  };

  const removeItem = (productId: string) => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const cartItems = JSON.parse(localCart);
      const filtered = cartItems.filter((item: any) => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(filtered));
      loadCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some premium firewood to your cart to get started!</p>
          <Link href="/products" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow divide-y">
              {cart.map((item) => (
                <div key={item.productId} className="p-6 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{formatCurrency(item.price)} / {item.unit_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100">-</button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100">+</button>
                  </div>
                  <div className="w-24 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                  <button onClick={() => removeItem(item.productId)} className="text-red-600 hover:text-red-700 p-2" title="Remove">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery fee</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">+ delivery fee</p>
              </div>
              <Link href="/checkout" className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 rounded-lg font-semibold transition">
                Proceed to Checkout
              </Link>
              <Link href="/products" className="block w-full text-center text-primary-600 hover:text-primary-700 py-3 mt-3 font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
