'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Check if user is admin
async function checkAdmin() {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

// ========== PRODUCTS ==========

export async function getAllProductsAdmin() {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images(*),
      product_categories(category_id, categories(*))
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
}

export async function createProduct(productData: any) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return { error: 'Failed to create product' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true, data };
}

export async function updateProduct(productId: string, productData: any) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return { error: 'Failed to update product' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true, data };
}

export async function deleteProduct(productId: string) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase.from('products').delete().eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { error: 'Failed to delete product' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

// ========== ORDERS ==========

export async function getAllOrdersAdmin() {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items(*),
      payment_methods(*),
      profiles(email, full_name)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data;
}

export async function getOrderById(orderId: string) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items(*, products(*)),
      payment_methods(*),
      profiles(email, full_name)
    `
    )
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const updateData: any = { status };

  // Set timestamp based on status
  if (status === 'shipped') {
    updateData.shipped_at = new Date().toISOString();
  } else if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString();
  } else if (status === 'cancelled') {
    updateData.cancelled_at = new Date().toISOString();
  }

  const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return { error: 'Failed to update order status' };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const updateData: any = { payment_status: paymentStatus };

  if (paymentStatus === 'paid') {
    updateData.paid_at = new Date().toISOString();
  }

  const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

  if (error) {
    console.error('Error updating payment status:', error);
    return { error: 'Failed to update payment status' };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

// ========== PAYMENT METHODS ==========

export async function getPaymentMethodsAdmin() {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }

  return data;
}

export async function createPaymentMethod(methodData: any) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .insert(methodData)
    .select()
    .single();

  if (error) {
    console.error('Error creating payment method:', error);
    return { error: 'Failed to create payment method' };
  }

  revalidatePath('/admin/payment-methods');
  return { success: true, data };
}

export async function updatePaymentMethod(methodId: string, methodData: any) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .update(methodData)
    .eq('id', methodId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment method:', error);
    return { error: 'Failed to update payment method' };
  }

  revalidatePath('/admin/payment-methods');
  return { success: true, data };
}

export async function deletePaymentMethod(methodId: string) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase.from('payment_methods').delete().eq('id', methodId);

  if (error) {
    console.error('Error deleting payment method:', error);
    return { error: 'Failed to delete payment method' };
  }

  revalidatePath('/admin/payment-methods');
  return { success: true };
}

export async function togglePaymentMethodStatus(methodId: string, currentStatus: boolean) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('payment_methods')
    .update({ is_active: !currentStatus })
    .eq('id', methodId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling payment method status:', error);
    return { error: 'Failed to update payment method status' };
  }

  revalidatePath('/admin/payment-methods');
  return { success: true, data };
}

// ========== USERS ==========

export async function getAllUsers() {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
}

export async function updateUserRole(userId: string, role: 'customer' | 'admin') {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return { error: 'Failed to update user role' };
  }

  revalidatePath('/admin/users');
  return { success: true };
}

// ========== CATEGORIES ==========

export async function getCategoriesAdmin() {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

export async function createCategory(categoryData: any) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return { error: 'Failed to create category' };
  }

  revalidatePath('/admin/categories');
  return { success: true, data };
}

export async function updateCategory(categoryId: string, categoryData: any) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    return { error: 'Failed to update category' };
  }

  revalidatePath('/admin/categories');
  return { success: true, data };
}

export async function deleteCategory(categoryId: string) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    console.error('Error deleting category:', error);
    return { error: 'Failed to delete category' };
  }

  revalidatePath('/admin/categories');
  return { success: true };
}

// ========== PRODUCT IMAGES ==========

export async function addProductImages(
  productId: string,
  images: Array<{ url: string; altText: string; isPrimary: boolean }>
) {
  await checkAdmin();
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('product_images')
    .insert(
      images.map((img) => ({
        product_id: productId,
        image_url: img.url,
        alt_text: img.altText,
        is_primary: img.isPrimary,
      }))
    )
    .select();

  if (error) {
    console.error('Error adding product images:', error);
    return { error: 'Failed to add product images' };
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true, data };
}

export async function deleteProductImage(imageId: string, imageUrl: string) {
  await checkAdmin();
  const supabase = await createAdminClient();

  // Delete from storage
  if (imageUrl.includes('supabase')) {
    // Extract file path from URL
    const urlParts = imageUrl.split('/product-images/');
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      await supabase.storage.from('product-images').remove([filePath]);
    }
  }

  // Delete from database
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);

  if (error) {
    console.error('Error deleting product image:', error);
    return { error: 'Failed to delete product image' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}

export async function setProductImagePrimary(imageId: string, productId: string) {
  await checkAdmin();
  const supabase = await createAdminClient();

  // First, set all images for this product to non-primary
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId);

  // Then set the selected image as primary
  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId);

  if (error) {
    console.error('Error setting primary image:', error);
    return { error: 'Failed to set primary image' };
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return { success: true };
}
