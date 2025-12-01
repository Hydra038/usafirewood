'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/app/actions/cart';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AddToCartButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isCheckingCart, setIsCheckingCart] = useState(false); // Changed to false - show button immediately

  // Check if item is already in cart (runs in background)
  useEffect(() => {
    async function checkCart() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      // Get cart
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cart) {
        return;
      }

      // Check if this product is in cart
      const { data: cartItem } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle();

      // Only update if item is found in cart
      if (cartItem) {
        setIsInCart(true);
      }
    }

    checkCart();
  }, [productId]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setMessage('');
    setIsError(false);

    try {
      const result = await addToCart(productId, quantity);

      if (result.error) {
        // Check if it's an authentication error
        if (result.error.includes('logged in')) {
          // Redirect to login with return URL
          const currentUrl = window.location.pathname;
          router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
          return;
        }
        
        setMessage(result.error);
        setIsError(true);
      } else {
        setMessage(`Successfully added ${quantity} ${quantity === 1 ? 'item' : 'items'} to your cart!`);
        setIsError(false);
        setIsInCart(true);
        
        // Dispatch custom event for cart count update
        window.dispatchEvent(new Event('cart-updated'));
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
        
        // Refresh to update cart count in navbar
        router.refresh();
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setIsError(true);
    }

    setIsAdding(false);
  };

  const isLoginError = message.includes('logged in');

  return (
    <div>
      {/* Success Message - Large and Prominent */}
      {message && !isError && (
        <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white shadow-2xl animate-fade-in border-2 border-green-400">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold mb-1">🎉 {message}</p>
              <p className="text-green-100 text-sm mb-3">Your item has been added successfully</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View Cart
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {message && isError && (
        <div className="mb-6 p-6 rounded-lg bg-red-50 border-2 border-red-300 shadow-lg animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-red-800">{message}</p>
              {isLoginError && (
                <div className="mt-3 flex gap-3">
                  <Link
                    href="/auth/login"
                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAdding || isInCart}
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center border border-gray-300 rounded py-2 disabled:opacity-50 disabled:bg-gray-100"
            min="1"
            disabled={isAdding || isInCart}
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAdding || isInCart}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart / Already in Cart Button */}
      {isInCart ? (
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-blue-800 font-semibold flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              This item is already in your cart
            </p>
          </div>
          <Link
            href="/cart"
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 px-6 rounded-lg font-semibold transition"
          >
            Go to Cart
          </Link>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full"
          size="lg"
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            'Add to Cart'
          )}
        </Button>
      )}
    </div>
  );
}
