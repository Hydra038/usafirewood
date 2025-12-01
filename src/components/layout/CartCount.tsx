'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCartCount() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCount(0);
        return;
      }

      // Get cart
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cart) {
        setCount(0);
        return;
      }

      // Get cart items count
      const { data: items } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('cart_id', cart.id);

      const itemCount = items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      setCount(itemCount);
    }

    fetchCartCount();

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdate);

    // Subscribe to cart changes
    const supabase = createClient();
    const channel = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
        },
        () => {
          fetchCartCount();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  );
}
