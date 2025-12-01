-- Storage RLS Policies for Product Images and Payment Proofs (SAFE VERSION)
-- This migration safely replaces existing policies without errors

-- ============================================================================
-- PRODUCT IMAGES BUCKET POLICIES
-- ============================================================================
-- First, ensure the product-images bucket exists
-- (Create it manually in Supabase Dashboard → Storage if not exists)

-- Drop existing policies if they exist (no errors if they don't)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Create fresh policies
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

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

-- Drop existing policies if they exist (no errors if they don't)
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete payment proofs" ON storage.objects;

-- Create fresh policies
CREATE POLICY "Public can view payment proofs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can update payment proofs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs');

CREATE POLICY "Authenticated users can delete payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
-- If you see this, all policies were created successfully!
-- 
-- Next steps:
-- 1. Verify buckets exist: product-images, payment-proofs
-- 2. Test product image upload (admin)
-- 3. Test payment proof upload (checkout)
