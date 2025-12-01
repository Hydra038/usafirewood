'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { updateCartItemQuantity, removeFromCart } from '@/app/actions/cart';
import { formatCurrency } from '@/lib/utils';

export default function CartItem({ item }: { item: any }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const product = item.products;
  const primaryImage = product.product_images?.find((img: any) => img.is_primary);
  const imageUrl = primaryImage?.image_url || '/placeholder-firewood.jpg';

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    setQuantity(newQuantity);

    await updateCartItemQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await removeFromCart(item.id);
  };

  return (
    <div className="flex gap-6 p-6 border-b last:border-b-0">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-100">
          <Image src={imageUrl} alt={product.name} fill className="object-cover" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-grow">
        <Link
          href={`/products/${product.slug}`}
          className="font-semibold text-lg hover:text-primary-600 transition"
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          {product.wood_type} • {product.unit_type.replace('_', ' ')}
        </p>
        <p className="text-gray-800 font-semibold mt-2">
          {formatCurrency(item.price_at_add)} each
        </p>
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating || quantity <= 1}
            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
          >
            −
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-primary-600 mb-2">
            {formatCurrency(item.price_at_add * quantity)}
          </p>
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
