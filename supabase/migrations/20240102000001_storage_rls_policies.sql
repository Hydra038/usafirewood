-- Storage RLS Policies for Product Images and Payment Proofs
-- This migration sets up Row Level Security policies for Supabase Storage buckets

-- ============================================================================
-- PRODUCT IMAGES BUCKET POLICIES
-- ============================================================================
-- First, ensure the product-images bucket exists
-- (Create it manually in Supabase Dashboard → Storage if not exists)
-- Set it as a PUBLIC bucket for easy access

-- Allow public to SELECT (view) product images
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow authenticated users (admins) to INSERT product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users (admins) to UPDATE product images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Allow authenticated users (admins) to DELETE product images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- ============================================================================
-- PAYMENT PROOFS BUCKET POLICIES
-- ============================================================================
-- First, ensure the payment-proofs bucket exists
-- (Create it manually in Supabase Dashboard → Storage if not exists)
-- Set it as a PUBLIC bucket for easy access

-- Allow public to SELECT (view) payment proofs (so admins can view them)
CREATE POLICY "Public can view payment proofs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to INSERT (upload) payment proofs
CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow authenticated users to UPDATE their payment proofs
CREATE POLICY "Authenticated users can update payment proofs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to DELETE their payment proofs
CREATE POLICY "Authenticated users can delete payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Before running this migration, create these buckets in Supabase Dashboard:
--    - product-images (PUBLIC bucket)
--    - payment-proofs (PUBLIC bucket)
--
-- 2. PUBLIC bucket means the files are publicly accessible via URL
--    But RLS policies still control who can upload/update/delete
--
-- 3. To create buckets:
--    a. Go to Supabase Dashboard → Storage
--    b. Click "New bucket"
--    c. Name: product-images, Public: YES
--    d. Click "New bucket" again
--    e. Name: payment-proofs, Public: YES
--
-- 4. After creating buckets, run this migration in SQL Editor
