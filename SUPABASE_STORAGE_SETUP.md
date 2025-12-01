# Supabase Storage Setup for Product Images

## 1. Create Storage Bucket in Supabase

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
   ```

2. **Navigate to Storage:**
   - Click "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create "product-images" Bucket:**
   - **Name:** `product-images`
   - **Public bucket:** ✅ **YES** (check this - images need to be publicly accessible)
   - **File size limit:** 5 MB (recommended)
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp, image/gif`
   - Click "Create bucket"

4. **Set Bucket Policies (Optional - if images aren't loading):**
   
   Go to Storage → product-images → Policies, and add these:

   **Policy 1: Public Read Access**
   ```sql
   -- Allow anyone to view images
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'product-images' );
   ```

   **Policy 2: Authenticated Upload**
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload images"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'product-images' 
     AND auth.role() = 'authenticated'
   );
   ```

   **Policy 3: Authenticated Delete**
   ```sql
   -- Allow authenticated users to delete their uploads
   CREATE POLICY "Authenticated users can delete images"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'product-images' 
     AND auth.role() = 'authenticated'
   );
   ```

## 2. Verify Bucket is Created

Run this query in SQL Editor to check:

```sql
SELECT * FROM storage.buckets WHERE name = 'product-images';
```

Should return:
- `id`: product-images
- `name`: product-images
- `public`: true

## 3. Test Upload (Optional)

You can test by uploading an image manually:
1. Go to Storage → product-images
2. Click "Upload file"
3. Upload a test image
4. Copy the public URL - should look like:
   ```
   https://pnqgzqzznesgamlwwcez.supabase.co/storage/v1/object/public/product-images/test.jpg
   ```

## 4. Environment Variables (Already Set)

Your `.env.local` already has these (no changes needed):
```env
NEXT_PUBLIC_SUPABASE_URL=https://pnqgzqzznesgamlwwcez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 5. Usage in Code

After setup, the upload will work automatically:

```typescript
// Upload image
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`${productId}/${fileName}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(`${productId}/${fileName}`);
```

## Troubleshooting

### Images won't upload
- Check bucket exists and is named exactly `product-images`
- Ensure bucket is marked as **Public**
- Check user is authenticated

### Images won't display
- Verify bucket is **Public**
- Check the RLS policies are set (see above)
- Ensure URL format is correct

### File size errors
- Default limit is 50MB
- Can be changed in bucket settings
- Recommended: 5MB for product images

---

**After creating the bucket, the image upload functionality in the admin forms will work automatically!**
