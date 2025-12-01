# 🚨 FIX: Policy Already Exists Error

## Error You're Seeing
```
Error: Failed to run sql query: 
ERROR: 42710: policy "Public can view payment proofs" for table "objects" already exists
```

---

## ✅ SOLUTION: Use the Safe Migration

### What Happened
You tried to create policies that already exist in your database (from a previous attempt).

### Quick Fix (1 minute)

1. **Open this file instead:**
   ```
   supabase/migrations/20240102000002_storage_rls_policies_safe.sql
   ```

2. **Copy ALL contents**

3. **Go to Supabase Dashboard → SQL Editor**

4. **Paste and click "Run"**

✅ **This version will work!** It uses `DROP POLICY IF EXISTS` to safely remove old policies before creating new ones.

---

## What's Different?

### ❌ Old Migration (causes errors)
```sql
CREATE POLICY "Public can view payment proofs"
-- Error if policy exists!
```

### ✅ Safe Migration (works always)
```sql
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
CREATE POLICY "Public can view payment proofs"
-- Always works, removes old policy first
```

---

## Next Steps After Running

### 1. Verify Buckets Exist
- [ ] `product-images` bucket exists (public: YES)
- [ ] `payment-proofs` bucket exists (public: YES)

If not, create them:
- Supabase Dashboard → Storage → New bucket

### 2. Test Uploads
- [ ] Upload product image (admin panel)
- [ ] Upload payment proof (checkout)
- [ ] Both should work without errors ✅

---

## Migration Files Summary

| File | Status | Use It? |
|------|--------|---------|
| `20240102000002_storage_rls_policies_safe.sql` | ✅ LATEST | **YES** |
| `20240102000001_storage_rls_policies.sql` | ⚠️ May error | No |
| `20240102000000_fix_payment_proof_storage.sql` | ❌ Deprecated | No |

---

## Still Getting Errors?

### "Bucket not found"
→ Create the buckets first (see step 1 above)

### "Access denied" or "RLS policy violation" after running migration
→ Make sure buckets are set to **PUBLIC**:
1. Supabase Dashboard → Storage
2. Click bucket name
3. Settings → Make public

### "Policy still exists"
→ Try running this cleanup first:
```sql
DROP POLICY IF EXISTS "Public can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
```

Then run the safe migration.

---

## ✅ Expected Result

After running the safe migration:

```
✅ Success. No rows returned
✅ Success. No rows returned
✅ Success. No rows returned
... (more success messages)
```

No errors! Ready to test uploads.
