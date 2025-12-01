'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get or create cart for user
  let { data: cart } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!cart) {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating cart:', error);
      return null;
    }

    cart = newCart;
  }

  // Get cart items with product details
  const { data: items, error } = await supabase
    .from('cart_items')
    .select(
      `
      *,
      products (
        *,
        product_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      )
    `
    )
    .eq('cart_id', cart.id);

  if (error) {
    console.error('Error fetching cart items:', error);
    return { ...cart, items: [] };
  }

  console.log('Cart items fetched:', items?.length || 0);
  if (items && items.length > 0) {
    console.log('First item:', JSON.stringify(items[0], null, 2));
    console.log('First item product:', items[0].products);
  }

  // Filter out items with null products (deleted products)
  const validItems = items?.filter(item => item.products !== null) || [];
  console.log('Valid items (with products):', validItems.length);

  return { ...cart, items: validItems };
}

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('Add to cart failed: No user logged in');
      return { error: 'You must be logged in to add items to cart' };
    }

    console.log('Adding to cart for user:', user.id, 'product:', productId);

    // Get or create cart
    let { data: cart, error: cartFetchError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (cartFetchError) {
      console.error('Error fetching cart:', cartFetchError);
      return { error: 'Failed to fetch cart: ' + cartFetchError.message };
    }

    if (!cart) {
      console.log('Creating new cart for user:', user.id);
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) {
        console.error('Error creating cart:', createError);
        return { error: 'Failed to create cart: ' + createError.message };
      }

      cart = newCart;
      console.log('Created cart:', cart.id);
    }

    // Get product price
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Error fetching product:', productError);
      return { error: 'Product not found' };
    }

    console.log('Product found, price:', product.price);

    // Check if item already in cart
    const { data: existingItem, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing item:', existingError);
    }

    if (existingItem) {
      // Update quantity
      console.log('Updating existing cart item:', existingItem.id);
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Error updating cart item:', updateError);
        return { error: 'Failed to update cart item: ' + updateError.message };
      }
    } else {
      // Add new item
      console.log('Adding new item to cart:', cart.id);
      const { error: insertError } = await supabase.from('cart_items').insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
        price_at_add: product.price,
      });

      if (insertError) {
        console.error('Error adding cart item:', insertError);
        return { error: 'Failed to add item to cart: ' + insertError.message };
      }
    }

    console.log('Successfully added/updated cart item');
    revalidatePath('/cart');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in addToCart:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createClient();

  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  if (error) {
    return { error: 'Failed to update cart item' };
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

  if (error) {
    return { error: 'Failed to remove item from cart' };
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function clearCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!cart) {
    return { success: true };
  }

  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);

  if (error) {
    return { error: 'Failed to clear cart' };
  }

  revalidatePath('/cart');
  return { success: true };
}
