'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { addToCart } from '@/app/actions/cart';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  wood_type: string;
  unit_type: string;
  is_heat_treated: boolean;
  stock_quantity: number;
  product_images?: Array<{
    image_url: string;
    alt_text?: string | null;
    is_primary: boolean;
  }>;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  const imageUrl = primaryImage?.image_url || '/placeholder-firewood.jpg';
  const altText = primaryImage?.alt_text || product.name;

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  // Check if item is already in cart on component mount (runs in background)
  useEffect(() => {
    async function checkCart() {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      // Get user's cart
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cart) {
        return;
      }

      // Check if this product is in the cart
      const { data: cartItem } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cart.id)
        .eq('product_id', product.id)
        .single();

      // Only update if item is found in cart
      if (cartItem) {
        setIsInCart(true);
      }
    }

    checkCart();
  }, [product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    setIsAdding(true);
    setShowError(false);
    setErrorMessage('');
    
    const result = await addToCart(product.id, 1);
    setIsAdding(false);

    if (result.error) {
      // Check if it's an authentication error
      if (result.error.includes('logged in')) {
        // Redirect to login with return URL
        const currentUrl = window.location.pathname;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }
      // Show error message
      setErrorMessage(result.error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } else {
      setShowSuccess(true);
      setIsInCart(true);
      
      // Dispatch custom event for cart count update
      window.dispatchEvent(new Event('cart-updated'));
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      // Refresh to update cart count
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative">
      {/* Large Success Message */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white z-20 p-4 flex flex-col items-center justify-center animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-5 rounded-lg shadow-2xl w-full border-2 border-green-400">
            <div className="flex items-start gap-3">
              <svg className="h-8 w-8 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex-1">
                <p className="text-lg font-bold mb-1">🎉 Added to cart!</p>
                <p className="text-green-100 text-xs mb-3">{product.name}</p>
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/cart" 
                    className="bg-white text-green-600 px-3 py-2 rounded-lg font-semibold text-center text-sm hover:bg-green-50 transition shadow-md hover:shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Cart
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSuccess(false);
                    }}
                    className="bg-green-700 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:bg-green-800 transition shadow-md hover:shadow-lg"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-10 text-sm font-medium max-w-xs text-center animate-fade-in">
          {errorMessage}
        </div>
      )}

      {/* Clickable Link Area */}
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image - 4:3 aspect ratio (only change) */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{discountPercent}%
            </div>
          )}
          {product.is_heat_treated && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
              🔥
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content - Original sizes */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {product.wood_type}
          </p>

          {/* Price - Original size */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Stock Status - Original size */}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <p className="text-sm text-orange-600 mb-2">
              {product.stock_quantity} left
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button - Original sizes */}
      <div className="px-4 pb-4">
        {isInCart ? (
          <>
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 font-semibold text-sm text-center">
                ✓ Already in your cart
              </p>
            </div>
            <Link
              href="/cart"
              onClick={(e) => e.stopPropagation()}
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded transition text-center"
            >
              Go to Cart
            </Link>
          </>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock_quantity === 0}
            className="w-full font-semibold py-2 px-4 rounded transition flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
          >
            {isAdding ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : product.stock_quantity === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
