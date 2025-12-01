# 🚀 Quick Start: Image Upload

## ⚠️ DO THIS FIRST (5 minutes)

Before you can upload images, you need to create a Supabase Storage bucket.

### Step 1: Open Supabase Dashboard
Visit: https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez

### Step 2: Go to Storage
Click **"Storage"** in the left sidebar

### Step 3: Create Bucket
1. Click **"New bucket"** button
2. Fill in:
   - **Name**: `product-images` (exactly this, no spaces)
   - **Public bucket**: ✅ **CHECK THIS BOX** (very important!)
   - **File size limit**: 5000000 (5MB in bytes)
   - **Allowed MIME types**: Add these one by one:
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `image/gif`
3. Click **"Create bucket"**

### Step 4: Add Security Policies
1. Click on the **"product-images"** bucket you just created
2. Click **"Policies"** tab at the top
3. Click **"New Policy"** button
4. Click **"Create a policy from scratch"**
5. Add 3 policies (one at a time):

**Policy 1: Let everyone see images**
- Name: `Public read access`
- Command: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'product-images'`
- Click **"Review"** then **"Save policy"**

**Policy 2: Let admins upload images**
- Name: `Authenticated upload`
- Command: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'product-images'`
- Click **"Review"** then **"Save policy"**

**Policy 3: Let admins delete images**
- Name: `Authenticated delete`
- Command: `DELETE`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'product-images'`
- Click **"Review"** then **"Save policy"**

### Step 5: Verify
You should see:
- ✅ Bucket named "product-images"
- ✅ "Public" badge on the bucket
- ✅ 3 policies showing in the Policies tab

---

## ✅ DONE! Now You Can Upload Images

### Test It Out:

1. **Start your dev server** (if not running):
   ```powershell
   npm run dev
   ```

2. **Login as admin**:
   - Go to: http://localhost:3000/auth/login
   - Email: `usa@firewood.com`
   - Password: `Derq@038!`

3. **Add a new product**:
   - Go to: http://localhost:3000/admin/products/new
   - Fill in the form
   - **Drag and drop images** into the upload area
   - OR click "Click to upload" to select files
   - Click "Create Product"

4. **Check it worked**:
   - Product should be created
   - Images should upload to Supabase
   - Go to Products page to see your new product

---

## 🎉 That's It!

You now have a fully functional image upload system. 

### What You Can Do:
- ✅ Upload multiple images per product
- ✅ Set one image as primary (main)
- ✅ Add alt text for SEO
- ✅ Remove/replace images
- ✅ Manage images on existing products

### Need Help?
- See `IMAGE_UPLOAD_COMPLETE.md` for full documentation
- See `SUPABASE_STORAGE_SETUP.md` for detailed setup instructions
