# Fix: Payment Proof Upload Storage Error

## Error Message
```
StorageApiError: new row violates row-level security policy
```

## Root Cause
The Supabase Storage bucket `payment-proofs` either:
1. Doesn't exist yet, OR
2. Exists but doesn't have proper RLS (Row Level Security) policies

## Solution: 2-Step Fix

### Step 1: Create Storage Bucket (if not exists)

**Go to Supabase Dashboard:**
1. Navigate to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Enter details:
   - **Name**: `payment-proofs`
   - **Public**: ✅ Check this box (allows public URL access for admins)
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: Leave empty (all types) or specify: `image/jpeg, image/png, image/jpg, image/webp`
4. Click **"Create bucket"**

### Step 2: Set Up RLS Policies

**Option A: Using Supabase SQL Editor (Recommended)**

1. Go to **SQL Editor** in Supabase Dashboard
2. Paste the contents of this file:
   ```
   supabase/migrations/20240102000000_fix_payment_proof_storage.sql
   ```
3. Click **"Run"**
4. Verify success message appears

**Option B: Using Storage Policies UI**

1. Go to **Storage** → **Policies** tab
2. Click **"New policy"**
3. Create these policies:

#### Policy 1: Upload Permission
```
Name: Authenticated users can upload payment proofs
Allowed operation: INSERT
Target roles: authenticated
Policy definition:
  bucket_id = 'payment-proofs'
```

#### Policy 2: View Permission (Authenticated)
```
Name: Users can view payment proofs
Allowed operation: SELECT
Target roles: authenticated
Policy definition:
  bucket_id = 'payment-proofs'
```

#### Policy 3: View Permission (Public)
```
Name: Public can view payment proofs
Allowed operation: SELECT
Target roles: public
Policy definition:
  bucket_id = 'payment-proofs'
```

#### Policy 4: Update Permission
```
Name: Users can update payment proofs
Allowed operation: UPDATE
Target roles: authenticated
Policy definition:
  bucket_id = 'payment-proofs'
```

#### Policy 5: Delete Permission (Optional)
```
Name: Users can delete payment proofs
Allowed operation: DELETE
Target roles: authenticated
Policy definition:
  bucket_id = 'payment-proofs'
```

## Verification Steps

### Test Upload Functionality

1. **Login to your app** as a regular user
2. **Go to checkout page** with items in cart
3. **Select a payment method**
4. **Choose a file** to upload as payment proof
5. **Submit the order**
6. **Expected result**: Order succeeds, no storage error

### Verify in Supabase

1. Go to **Storage** → **payment-proofs** bucket
2. You should see uploaded files listed
3. Click on a file to get the public URL
4. The URL should be accessible

## File Upload Code

The upload happens in `src/app/checkout/page.tsx`:

```typescript
// Upload payment proof if provided
if (formData.paymentProofFile) {
  const fileExt = formData.paymentProofFile.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, formData.paymentProofFile);

  if (uploadError) {
    console.error('Error uploading payment proof:', uploadError);
    setError('Failed to upload payment proof. Please try again.');
    setSubmitting(false);
    return;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(filePath);

  paymentProofUrl = publicUrl;
}
```

## Common Issues & Solutions

### Issue 1: Bucket Not Found
**Error**: `Bucket not found`

**Solution**: 
- Create the bucket in Supabase Dashboard (see Step 1)
- Verify bucket name is exactly: `payment-proofs` (with hyphen, not underscore)

### Issue 2: Policy Still Blocking After Creation
**Error**: Still getting RLS error after adding policies

**Solution**:
1. Check if policies are enabled (toggle should be ON)
2. Verify policy definitions match exactly
3. Try deleting and recreating policies
4. Clear browser cache and try again

### Issue 3: Public Access Not Working
**Error**: Uploaded files are not accessible via public URL

**Solution**:
1. Ensure bucket is marked as **Public** when created
2. Verify "Public can view payment proofs" policy exists
3. Check the public URL format:
   ```
   https://[project-ref].supabase.co/storage/v1/object/public/payment-proofs/[filename]
   ```

### Issue 4: File Size Too Large
**Error**: `Payload too large`

**Solution**:
- Bucket default limit is 50MB
- Set a custom limit in bucket settings
- Recommended: 5-10MB for payment screenshots
- Add client-side validation to warn users

## Security Considerations

### Current Setup
- ✅ Only authenticated users can upload
- ✅ Public can view (needed for admin panel)
- ✅ Unique filenames prevent overwrites
- ✅ Files stored with user ID prefix

### Potential Improvements
1. **Restrict viewing to admins + file owner**:
   ```sql
   CREATE POLICY "Only admins and owner can view"
   ON storage.objects
   FOR SELECT
   TO authenticated
   USING (
     bucket_id = 'payment-proofs' AND (
       auth.uid()::text = split_part(name, '-', 1) OR
       EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       )
     )
   );
   ```

2. **File type validation**:
   - Add MIME type restrictions in bucket settings
   - Client-side validation in upload form

3. **Virus scanning** (advanced):
   - Use Supabase Functions + ClamAV
   - Or integrate third-party scanning service

## Testing Checklist

After applying the fix:

- [ ] Bucket `payment-proofs` exists
- [ ] All 5 RLS policies are created and enabled
- [ ] Can upload file from checkout page (logged in)
- [ ] File appears in Supabase Storage bucket
- [ ] Public URL is accessible
- [ ] Order saves with payment_proof_url in database
- [ ] Admin can view the uploaded proof (if admin panel supports it)
- [ ] No console errors during upload

## Quick Fix Summary

**If you just want it to work ASAP:**

```sql
-- Run this in Supabase SQL Editor:

CREATE POLICY "Anyone authenticated can use payment-proofs"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'payment-proofs')
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Public can view payment-proofs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');
```

Then create the bucket if it doesn't exist.

## Need Help?

If the error persists:

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Filter by Storage
   - Look for detailed error messages

2. **Verify User Authentication**:
   - Ensure user is actually logged in
   - Check `await supabase.auth.getUser()` returns valid user

3. **Test with Supabase CLI**:
   ```bash
   supabase storage create payment-proofs
   supabase storage policies list
   ```

4. **Contact Support**:
   - Supabase Discord: https://discord.supabase.com
   - GitHub Issues: https://github.com/supabase/supabase

---

**Status**: Ready to apply  
**Estimated Time**: 5 minutes  
**Required Access**: Supabase Dashboard admin access
