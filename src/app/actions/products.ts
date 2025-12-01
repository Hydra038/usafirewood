'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getProducts(filters?: {
  category?: string;
  woodType?: string;
  featured?: boolean;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(
      `
      *,
      product_images(*),
      product_categories(category_id, categories(*))
    `
    )
    .eq('is_active', true);

  if (filters?.featured) {
    query = query.eq('is_featured', true);
  }

  if (filters?.woodType) {
    query = query.eq('wood_type', filters.woodType);
  }

  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_images(*),
      product_categories(category_id, categories(*))
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}
