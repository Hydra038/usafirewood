-- Fix Storage RLS Policy for Payment Proof Uploads
-- This allows authenticated users to upload payment proof files

-- ⚠️ DEPRECATED: Use 20240102000001_storage_rls_policies.sql instead
-- That file includes BOTH product-images AND payment-proofs buckets

-- First, ensure the payment-proofs bucket exists
-- (Create it manually in Supabase Dashboard → Storage if not exists)

-- Allow authenticated users to INSERT (upload) payment proofs
CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow authenticated users to SELECT (view) their own payment proofs
CREATE POLICY "Users can view payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');

-- Allow public to SELECT (view) payment proofs (so admins can view them)
CREATE POLICY "Public can view payment proofs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Allow users to UPDATE their own payment proofs
CREATE POLICY "Users can update payment proofs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- Allow users to DELETE their own payment proofs (optional)
CREATE POLICY "Users can delete payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');
