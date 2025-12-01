# 🔧 Supabase Storage Setup - Complete Guide

## 🎯 Quick Overview

You need to set up **2 storage buckets** in Supabase and apply RLS policies:
1. **product-images** - For product photos (admin uploads)
2. **payment-proofs** - For customer payment confirmations (user uploads)

---

## 📋 Step-by-Step Setup

### Step 1: Create Storage Buckets

1. **Go to Supabase Dashboard**
   - Open your project at [supabase.com](https://supabase.com)
   - Navigate to **Storage** in the left sidebar

2. **Create Product Images Bucket**
   - Click **"New bucket"** button
   - **Name:** `product-images`
   - **Public bucket:** ✅ YES (check this box)
   - Click **"Create bucket"**

3. **Create Payment Proofs Bucket**
   - Click **"New bucket"** button again
   - **Name:** `payment-proofs`
   - **Public bucket:** ✅ YES (check this box)
   - Click **"Create bucket"**

### Step 2: Apply RLS Policies

1. **Navigate to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **"New query"**

2. **Run the Migration**
   - Copy ALL contents from this file:
     ```
     supabase/migrations/20240102000002_storage_rls_policies_safe.sql
     ```
   - Paste into the SQL Editor
   - Click **"Run"** button
   
   **Note:** This version uses `DROP POLICY IF EXISTS` to safely handle any existing policies without errors.

3. **Verify Success**
   - You should see: ✅ Success messages
   - No errors should appear

---

## ✅ Verification Checklist

After setup, verify everything works:

### Test Product Image Upload (Admin)
- [ ] Log in as admin
- [ ] Go to Admin Dashboard → Products
- [ ] Click "Edit" on any product
- [ ] Try uploading a product image
- [ ] ✅ Image should upload successfully
- [ ] ❌ No "violates row-level security policy" error

### Test Payment Proof Upload (Customer)
- [ ] Log in as a regular user
- [ ] Add products to cart
- [ ] Go to checkout
- [ ] Upload a payment proof screenshot
- [ ] Complete order
- [ ] ✅ Image should upload successfully
- [ ] ❌ No storage errors

### Test Admin Payment Proof View
- [ ] Log in as admin
- [ ] Go to Admin Dashboard → Orders
- [ ] Click "View" on an order with payment proof
- [ ] ✅ Should see payment proof image preview
- [ ] ✅ "View Full Size" button works
- [ ] ✅ "Download Image" button works
- [ ] ✅ "Copy URL" button works

---

## 🔍 Troubleshooting

### Error: "policy already exists"
**Full Error:** `ERROR: 42710: policy "Public can view payment proofs" for table "objects" already exists`

**Solution:** Use the safe migration file instead:
- ❌ Don't use: `20240102000001_storage_rls_policies.sql`
- ✅ Use instead: `20240102000002_storage_rls_policies_safe.sql`

The safe version uses `DROP POLICY IF EXISTS` to remove existing policies before creating new ones.

### Error: "Bucket not found"
**Solution:** Go back to Step 1 and create the buckets

### Error: "new row violates row-level security policy"
**Solution:** Run the SQL migration from Step 2

### Error: "Image not displaying"
**Solution:** 
1. Verify bucket is set to **PUBLIC**
2. Check bucket name spelling matches exactly:
   - `product-images` (not product_images)
   - `payment-proofs` (not payment_proofs)

### Error: "Access denied"
**Solution:**
1. Verify you're logged in as admin (for product images)
2. Verify you're authenticated (for payment proofs)
3. Re-run the RLS policies migration

---

## 📂 Bucket Configuration Summary

| Bucket Name | Public | Purpose | Who Can Upload |
|-------------|--------|---------|----------------|
| `product-images` | ✅ Yes | Product photos | Admins only |
| `payment-proofs` | ✅ Yes | Payment confirmations | All authenticated users |

---

## 🔐 Security Notes

### RLS Policies Explained

**Product Images:**
- Anyone can VIEW (public access to product photos)
- Only authenticated users can UPLOAD/UPDATE/DELETE (admins)

**Payment Proofs:**
- Anyone can VIEW (so admins can see them)
- Only authenticated users can UPLOAD/UPDATE/DELETE (customers)

### Why Public Buckets?

Public buckets allow direct URL access to files without authentication tokens. This is necessary for:
- Product images displayed on the public store
- Admin viewing payment proofs from different browsers/sessions

The RLS policies still control who can upload, update, or delete files.

---

## 📝 File Locations

- **Migration File (USE THIS):** `supabase/migrations/20240102000002_storage_rls_policies_safe.sql`
- **Old Migration (may cause errors):** `supabase/migrations/20240102000001_storage_rls_policies.sql`
- **Old Migration (payment-proofs only):** `supabase/migrations/20240102000000_fix_payment_proof_storage.sql`
- **Product Upload Code:** `src/app/admin/products/[id]/edit/page.tsx`
- **Payment Upload Code:** `src/app/checkout/page.tsx`

---

## ⚡ Quick Setup (Copy-Paste)

If you prefer command-line setup, you can use the Supabase CLI:

```bash
# Create product-images bucket
supabase storage create product-images --public

# Create payment-proofs bucket
supabase storage create payment-proofs --public

# Apply RLS policies
supabase db push
```

---

## 🎉 Done!

Once you've completed both steps, all storage-related errors should be resolved. Test the upload features to confirm everything works!

If you still encounter issues, check the browser console for specific error messages.
