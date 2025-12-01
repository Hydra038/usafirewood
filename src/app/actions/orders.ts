'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { calculateDistance, calculateDeliveryFee } from '@/lib/utils/delivery';

export async function createOrder(orderData: {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  delivery_type: 'delivery' | 'pickup';
  payment_method_id: string;
  customer_notes?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  payment_proof_url?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to place an order' };
  }

  // Get cart items
  const { data: cart } = await supabase
    .from('carts')
    .select(
      `
      *,
      cart_items(*, products(*))
    `
    )
    .eq('user_id', user.id)
    .single();

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return { error: 'Your cart is empty' };
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = cart.cart_items.map((item: any) => {
    const itemTotal = item.quantity * item.price_at_add;
    subtotal += itemTotal;
    return {
      product_id: item.product_id,
      product_name: item.products.name,
      product_sku: item.products.sku,
      wood_type: item.products.wood_type,
      unit_type: item.products.unit_type,
      is_heat_treated: item.products.is_heat_treated,
      quantity: item.quantity,
      unit_price: item.price_at_add,
      total_price: itemTotal,
    };
  });

  // Calculate delivery fee (flat rate)
  const deliveryFee = orderData.delivery_type === 'delivery' 
    ? parseFloat(process.env.NEXT_PUBLIC_FLAT_DELIVERY_FEE || '25')
    : 0;

  const tax = 0; // Implement tax calculation based on your requirements
  const total = subtotal + deliveryFee + tax;

  // Get next order number from database function
  const { data: orderNumberData } = await supabase.rpc('generate_order_number');
  const orderNumber = orderNumberData || `FW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      customer_email: orderData.customer_email,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      shipping_address_line1: orderData.shipping_address_line1,
      shipping_address_line2: orderData.shipping_address_line2,
      shipping_city: orderData.shipping_city,
      shipping_state: orderData.shipping_state,
      shipping_zip: orderData.shipping_zip,
      delivery_type: orderData.delivery_type,
      delivery_distance_miles: null,
      delivery_latitude: orderData.delivery_latitude,
      delivery_longitude: orderData.delivery_longitude,
      subtotal,
      delivery_fee: deliveryFee,
      tax,
      total,
      payment_method_id: orderData.payment_method_id,
      payment_proof_url: orderData.payment_proof_url,
      customer_notes: orderData.customer_notes,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return { error: 'Failed to create order' };
  }

  // Create order items
  const orderItemsWithOrderId = orderItems.map((item: any) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithOrderId);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Rollback: delete the order
    await supabase.from('orders').delete().eq('id', order.id);
    return { error: 'Failed to create order items' };
  }

  // Clear cart
  await supabase.from('cart_items').delete().eq('cart_id', cart.id);

  revalidatePath('/cart');
  revalidatePath('/dashboard/orders');

  return { success: true, order };
}

export async function getUserOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items(*),
      payment_methods(*)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data;
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items(*),
      payment_methods(*),
      deliveries(*)
    `
    )
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

export async function getPaymentMethods() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }

  return data;
}
