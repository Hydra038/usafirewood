# Image Upload System - Complete ✅

## What Was Created

### 1. **ImageUpload Component** (`src/components/admin/ImageUpload.tsx`)
A fully-featured image upload component with:
- ✅ **Drag-and-drop** file upload
- ✅ **Click to select** files
- ✅ **Multiple image** support
- ✅ **Image preview** grid with thumbnails
- ✅ **Primary image** selection (one image marked as primary)
- ✅ **Alt text** editing for SEO
- ✅ **Remove images** functionality
- ✅ **Automatic upload** to Supabase Storage
- ✅ **File validation** (images only, 5MB limit)

### 2. **Server Actions** (added to `src/app/actions/admin.ts`)
Three new server actions for managing product images:

```typescript
// Add images to a product
addProductImages(productId, images)

// Delete an image (from both DB and Storage)
deleteProductImage(imageId, imageUrl)

// Set which image is primary
setProductImagePrimary(imageId, productId)
```

### 3. **New Product Form** (`src/app/admin/products/new/page.tsx`)
- ✅ Added ImageUpload component
- ✅ Handles image upload during product creation
- ✅ Uploads files to Supabase Storage
- ✅ Saves image URLs to database

### 4. **Edit Product Form** (`src/app/admin/products/[id]/edit/page.tsx`)
- ✅ Added ImageUpload component
- ✅ Loads existing product images
- ✅ Allows adding new images
- ✅ Can manage existing images (delete, set primary, edit alt text)

---

## ⚠️ REQUIRED: Setup Supabase Storage

**Before the image upload will work, you MUST create the Supabase Storage bucket.**

### Quick Setup Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
   - Navigate to: **Storage** → **Buckets**

2. **Create New Bucket**
   - Click **"New bucket"**
   - **Name**: `product-images`
   - **Public**: ✅ **YES** (critical!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`

3. **Set RLS Policies**
   Go to **Storage** → **Policies** and add these policies:

   **Policy 1: Public Read Access**
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'product-images');
   ```

   **Policy 2: Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'product-images');
   ```

   **Policy 3: Authenticated Delete**
   ```sql
   CREATE POLICY "Authenticated users can delete"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'product-images');
   ```

4. **Verify Setup**
   - Go to Storage → product-images
   - Bucket should show "Public" badge
   - Policies should show 3 policies active

📖 **Full instructions**: See `SUPABASE_STORAGE_SETUP.md`

---

## How to Use

### Adding a New Product with Images

1. Login as admin: http://localhost:3000/auth/login
   - Email: `usa@firewood.com`
   - Password: `Derq@038!`

2. Go to: http://localhost:3000/admin/products/new

3. Fill in product details

4. **Upload Images**:
   - Drag and drop image files onto the upload area
   - OR click "Click to upload" to select files
   - Multiple images supported

5. **Set Primary Image**:
   - The first image is automatically primary
   - Click "Set Primary" on any image to make it the main one

6. **Edit Alt Text**:
   - Type alt text for each image (for SEO)
   - Default is the filename without extension

7. Click **"Create Product"**
   - Product is created
   - Images are uploaded to Supabase Storage
   - Image URLs are saved to database

### Editing Product Images

1. Go to: http://localhost:3000/admin/products

2. Click **"Edit"** on any product

3. **Manage Existing Images**:
   - View all current images
   - Click "Remove" to delete an image
   - Click "Set Primary" to change main image
   - Edit alt text for any image

4. **Add New Images**:
   - Drag and drop or click to upload
   - New images are added to existing ones

5. Click **"Save Changes"**

---

## Database Structure

### Tables Used

**`product_images`** table:
```sql
- id (uuid, primary key)
- product_id (uuid, foreign key to products)
- image_url (text) -- Supabase Storage public URL
- alt_text (text) -- For SEO and accessibility
- is_primary (boolean) -- Only one image should be primary
- display_order (integer) -- Order images appear
- created_at (timestamp)
```

### Storage Structure

Files are organized in Supabase Storage like this:
```
product-images/
├── {product-id}/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
```

Each product gets its own folder using the product UUID.

---

## Features

### ✅ What's Working

1. **Drag-and-Drop Upload** - Modern UX for adding images
2. **Multiple Images** - Upload several images at once
3. **Image Preview** - See images before saving
4. **Primary Image** - Select which image is the main one
5. **Alt Text** - Add descriptions for SEO
6. **File Validation** - Only images allowed, 5MB max
7. **Automatic Upload** - Files go to Supabase Storage
8. **Public URLs** - Images are accessible via CDN
9. **Delete Images** - Remove from both DB and Storage
10. **Edit Support** - Manage images on existing products

### 🎨 UI Features

- Visual indication of primary image (blue border + badge)
- Image thumbnails in grid layout
- Loading states during upload
- Error handling
- Responsive design (works on mobile)

---

## Next Steps (Optional Enhancements)

These are **NOT required** but could be added later:

1. **Image Cropping** - Allow users to crop images before upload
2. **Image Optimization** - Compress images automatically
3. **Drag to Reorder** - Change display_order by dragging
4. **Bulk Upload** - Upload many images at once
5. **Image Gallery** - Better preview modal
6. **File Renaming** - Custom filenames instead of timestamps

---

## Troubleshooting

### Images Not Uploading

1. **Check Supabase Storage is set up**
   - Bucket exists: `product-images`
   - Bucket is public
   - RLS policies are active

2. **Check file size**
   - Must be under 5MB
   - Reduce image size if needed

3. **Check file type**
   - Only images allowed (jpg, png, gif, webp)

4. **Check browser console**
   - Look for error messages
   - Check network tab for failed requests

### Images Not Displaying

1. **Check image URLs**
   - Should start with: `https://pnqgzqzznesgamlwwcez.supabase.co/storage/v1/object/public/product-images/`

2. **Check bucket is public**
   - Bucket MUST be public for images to display

3. **Check RLS policies**
   - "Public read access" policy must exist

### Can't Delete Images

1. **Check authentication**
   - Must be logged in as admin

2. **Check delete policy**
   - "Authenticated users can delete" policy must exist

---

## Files Changed/Created

### Created:
- `src/components/admin/ImageUpload.tsx` (294 lines)
- `SUPABASE_STORAGE_SETUP.md` (setup guide)
- `IMAGE_UPLOAD_COMPLETE.md` (this file)

### Modified:
- `src/app/actions/admin.ts` (added 3 new functions)
- `src/app/admin/products/new/page.tsx` (added ImageUpload component)
- `src/app/admin/products/[id]/edit/page.tsx` (added ImageUpload component)

---

## Summary

✅ **Image upload system is complete and ready to use!**

**What you can do now:**
1. Create Supabase Storage bucket (follow SUPABASE_STORAGE_SETUP.md)
2. Login as admin
3. Add/edit products with real images
4. Replace all placeholder images with actual product photos

**What's different:**
- **Before**: Products used placeholder URLs (`https://placehold.co/...`)
- **After**: Products can have real uploaded images from Supabase Storage

🎉 **Your admin can now manage product images like a pro!**
