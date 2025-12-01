# 🚀 STORAGE QUICK FIX

## Current Error
```
StorageApiError: new row violates row-level security policy
```

## Root Cause
Missing storage buckets and RLS policies in Supabase

---

## ✅ 3-STEP FIX

### 1️⃣ Create Buckets (2 minutes)
Open Supabase Dashboard → Storage → New bucket

**Bucket 1:**
- Name: `product-images`
- Public: ✅ YES

**Bucket 2:**
- Name: `payment-proofs`
- Public: ✅ YES

### 2️⃣ Apply RLS Policies (1 minute)
1. Open: `supabase/migrations/20240102000002_storage_rls_policies_safe.sql`
2. Copy entire file contents
3. Supabase Dashboard → SQL Editor → Paste → Run

**Note:** This version safely handles existing policies (no duplicate errors)

### 3️⃣ Test (1 minute)
- Upload product image as admin ✅
- Upload payment proof as customer ✅

---

## 📖 Full Guide
See: `STORAGE_SETUP_COMPLETE.md`

---

## 🔧 Files Changed
- ✅ Created: `20240102000002_storage_rls_policies_safe.sql` (USE THIS - handles existing policies)
- ✅ Created: `20240102000001_storage_rls_policies.sql` (old - may error)
- ✅ Created: `STORAGE_SETUP_COMPLETE.md` (detailed guide)
- ✅ Deprecated: `20240102000000_fix_payment_proof_storage.sql` (old)

---

## ⏱️ Total Time: ~4 minutes
