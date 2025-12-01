import { z } from 'zod';

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  compare_at_price: z.number().positive().optional().nullable(),
  stock_quantity: z.number().int().min(0),
  sku: z.string().optional().nullable(),
  wood_type: z.string().min(1, 'Wood type is required'),
  unit_type: z.enum(['cord', 'face_cord', 'bundle', 'rack']),
  is_heat_treated: z.boolean().default(false),
  moisture_content: z.number().min(0).max(100).optional().nullable(),
  is_seasoned: z.boolean().default(false),
  is_kiln_dried: z.boolean().default(false),
  weight_lbs: z.number().positive().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  meta_title: z.string().max(60).optional().nullable(),
  meta_description: z.string().max(160).optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

// Checkout schemas
export const checkoutSchema = z.object({
  // Customer info
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number required'),

  // Shipping address
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('USA'),

  // Delivery
  delivery_type: z.enum(['delivery', 'pickup']),
  payment_method_id: z.string().uuid('Please select a payment method'),

  // Notes
  customer_notes: z.string().max(500).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Payment method schemas
export const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.string().default('manual'),
  instructions: z.string().optional(),
  account_username: z.string().optional().nullable(),
  qr_code_url: z.string().url().optional().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

// Order update schemas
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  admin_notes: z.string().max(1000).optional(),
});

export const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']),
});

// Profile schemas
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Category schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
