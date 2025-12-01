# Payment Methods & Checkout Enhancements

## Overview
Fixed payment method edit functionality, added Venmo direct payment links, and implemented payment proof upload feature for checkout.

## Issues Fixed & Features Added

### 1. **Payment Method Edit Page (FIXED)**
**Problem:** The edit link in `/admin/payment-methods` was broken - the route didn't exist.

**Solution:** Created complete edit and new pages:
- `src/app/admin/payment-methods/[id]/edit/page.tsx` - Edit existing payment methods
- `src/app/admin/payment-methods/new/page.tsx` - Create new payment methods

**Features:**
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Form validation
- ✅ Active/inactive toggle
- ✅ Display order management
- ✅ Delete confirmation dialog

### 2. **Venmo Direct Payment Link**
**Problem:** Users had to manually copy Venmo username and open the app separately.

**Solution:** Added `venmo_link` field to payment methods.

**Features:**
- ✅ Clickable "Pay with Venmo" button in checkout
- ✅ Opens Venmo app or website directly
- ✅ Admin can configure Venmo link in payment method settings
- ✅ Beautiful blue button with Venmo logo icon

**User Experience:**
```
Before: Copy @username → Open Venmo → Search → Pay
After:  Click "Pay with Venmo" → Venmo opens → Pay ✓
```

### 3. **Payment Proof Upload**
**Problem:** No way for customers to submit payment confirmation screenshots.

**Solution:** Added file upload feature to checkout page.

**Features:**
- ✅ Image upload directly from checkout
- ✅ Stored in Supabase Storage (`payment-proofs` bucket)
- ✅ Public URL saved to orders table
- ✅ Admin can view proof in order details
- ✅ Helps verify and process payments faster

## Database Changes

### Migration File
**File:** `supabase/migrations/20240101000002_add_payment_features.sql`

```sql
-- Add venmo_link to payment_methods
ALTER TABLE payment_methods 
ADD COLUMN IF NOT EXISTS venmo_link TEXT;

-- Add payment_proof_url to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
```

**Run in Supabase:**
1. Go to Supabase Dashboard → SQL Editor
2. Paste the migration SQL
3. Click "Run"

### Supabase Storage Setup

**Create Storage Bucket:**
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `payment-proofs`
4. Set as **Public** bucket
5. Click "Create"

**Set Storage Policies:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow public read access
CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');
```

## Files Created/Modified

### Created Files

1. **`src/app/admin/payment-methods/[id]/edit/page.tsx`**
   - Edit existing payment methods
   - Delete payment methods
   - Full form with all fields

2. **`src/app/admin/payment-methods/new/page.tsx`**
   - Create new payment methods
   - Same form fields as edit page

3. **`supabase/migrations/20240101000002_add_payment_features.sql`**
   - Database migration for new fields

### Modified Files

1. **`src/app/checkout/page.tsx`**
   - Added `venmo_link` to PaymentMethod type
   - Added `paymentProofFile` to form state
   - Added file upload UI
   - Added Venmo button with icon
   - Added payment proof upload logic
   - Updated handleSubmit to upload file to Supabase Storage

2. **`src/app/actions/orders.ts`**
   - Added `payment_proof_url` to createOrder function parameters
   - Store payment proof URL in orders table

## Features in Detail

### Payment Method Edit Page

**URL:** `/admin/payment-methods/[id]/edit`

**Fields:**
- Payment Method Name (required)
- Type (manual/online)
- Instructions (textarea)
- Account Username (optional)
- **Venmo Link (NEW)** - Direct payment link
- QR Code URL (optional)
- Display Order (number)
- Active status (checkbox)

**Actions:**
- Save Changes
- Delete Payment Method
- Cancel (go back)

### Venmo Payment Link

**Admin Configuration:**
```
Venmo Link: https://venmo.com/yourusername
or: https://venmo.com/u/yourusername
```

**Checkout Display:**
```tsx
<a href={venmoLink} target="_blank">
  <VenmoIcon /> Pay with Venmo
</a>
```

**Click Behavior:**
- Desktop: Opens Venmo website in new tab
- Mobile: Opens Venmo app if installed
- Fallback: Opens Venmo mobile website

### Payment Proof Upload

**Checkout Form Section:**
```
┌─────────────────────────────────────┐
│ Upload Payment Proof (Optional)     │
│ [Choose File] screenshot.png        │
│ ✓ screenshot.png selected   Remove  │
│                                     │
│ ℹ️ Upload a screenshot or photo of │
│   your payment confirmation         │
└─────────────────────────────────────┘
```

**Upload Process:**
1. User selects image file
2. Form shows filename and remove button
3. On submit, file uploads to Supabase Storage
4. Public URL saved to `orders.payment_proof_url`
5. Admin can view in order details

**File Storage:**
- Bucket: `payment-proofs`
- Path: `{userId}-{timestamp}.{ext}`
- Example: `uuid-1234567890.jpg`
- Public URL for admin viewing

## User Flow

### For Customers

**Checkout with Venmo:**
1. Select payment method (e.g., "Venmo")
2. See account username display
3. **Click "Pay with Venmo" button** ← NEW
4. Venmo opens automatically
5. Make payment
6. Take screenshot of confirmation
7. **Upload screenshot** ← NEW
8. Place order

**Before These Changes:**
- 6-7 manual steps
- Copy/paste username
- Switch apps manually

**After These Changes:**
- 4-5 steps
- One-click to Venmo
- Direct upload from checkout

### For Admins

**Managing Payment Methods:**
1. Go to `/admin/payment-methods`
2. Click "Edit" on any payment method ← NOW WORKS!
3. Update fields including Venmo link
4. Save changes
5. View payment proof in order details

**Processing Orders:**
1. View order in admin panel
2. See payment proof image if uploaded
3. Verify payment matches order
4. Update order status

## Styling & UX

### Venmo Button
```css
- Blue background (#1E88E5)
- White Venmo logo icon
- Hover effect (darker blue)
- Opens in new tab
- Mobile-responsive
```

### Payment Proof Upload
```css
- Custom file input styling
- Primary color theme
- Selected file indicator
- Remove file option
- Helper text
- Success state (✓ checkmark)
```

### Payment Instructions Box
```css
- Blue background (#EFF6FF)
- Icon + content layout
- Venmo button prominent
- QR code display
- Warning message (yellow box)
```

## Testing Checklist

### Payment Method Edit
- [ ] Click "Edit" on payment method
- [ ] Edit page loads successfully
- [ ] All fields populate correctly
- [ ] Can update fields
- [ ] Save button works
- [ ] Redirects back to list
- [ ] Changes persist in database
- [ ] Delete button works with confirmation

### Venmo Link
- [ ] Add Venmo link in payment method
- [ ] Link appears in checkout
- [ ] "Pay with Venmo" button displays
- [ ] Button has Venmo icon
- [ ] Click opens Venmo (new tab)
- [ ] Works on mobile and desktop

### Payment Proof Upload
- [ ] File input appears when payment method selected
- [ ] Can select image file
- [ ] Selected filename displays
- [ ] Can remove selected file
- [ ] Upload works on form submit
- [ ] File appears in Supabase Storage
- [ ] Public URL saved to order
- [ ] No errors if file not uploaded (optional field)

## Environment Variables

Add to `.env.local`:
```env
# Already exists
NEXT_PUBLIC_FLAT_DELIVERY_FEE=25

# Supabase (should already be set)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Security Considerations

### File Upload
- ✅ Only authenticated users can upload
- ✅ Files stored in dedicated bucket
- ✅ Unique filenames prevent overwrites
- ✅ File type restricted to images
- ✅ Public bucket for admin viewing
- ⚠️ Consider: File size limits (implement if needed)
- ⚠️ Consider: Virus scanning (implement if needed)

### Payment Links
- ✅ Links validated as URLs
- ✅ Stored as text, not executed
- ✅ Opens in new tab (_blank)
- ✅ rel="noopener noreferrer" for security

## Future Enhancements

### Potential Improvements:
1. **Image Preview** - Show thumbnail of uploaded proof
2. **Multiple Files** - Allow multiple payment screenshots
3. **Image Compression** - Reduce file size before upload
4. **Admin Notification** - Email alert when proof uploaded
5. **Payment Status** - Auto-mark as "paid" when proof uploaded
6. **Other Payment Links** - Add Cash App, PayPal direct links
7. **QR Code Upload** - Upload QR code images directly from admin

### Example: Image Preview
```tsx
{formData.paymentProofFile && (
  <img 
    src={URL.createObjectURL(formData.paymentProofFile)}
    className="w-32 h-32 object-cover rounded"
  />
)}
```

## Troubleshooting

### Edit Page Returns 404
**Problem:** Route doesn't exist yet

**Solution:** 
1. Ensure file exists at correct path
2. Restart dev server
3. Check file structure matches Next.js 13+ app router

### Venmo Link Doesn't Work
**Problem:** Invalid URL format

**Solution:**
- Use full URL: `https://venmo.com/username`
- Check for typos
- Test link before saving

### File Upload Fails
**Problem:** Storage bucket not created or permissions wrong

**Solution:**
1. Create `payment-proofs` bucket in Supabase
2. Set bucket to public
3. Add storage policies (see above)
4. Check file size limits

### Payment Proof URL Not Saving
**Problem:** Database column doesn't exist

**Solution:**
1. Run migration SQL in Supabase
2. Verify column exists: `SELECT * FROM orders LIMIT 1`
3. Check for SQL errors in Supabase logs

## Migration Checklist

1. [ ] Run database migration SQL
2. [ ] Create Supabase Storage bucket
3. [ ] Set storage policies
4. [ ] Deploy new code
5. [ ] Test edit page
6. [ ] Test Venmo link
7. [ ] Test file upload
8. [ ] Update admin documentation
9. [ ] Train staff on new features

---

**Status:** ✅ Complete and ready for testing  
**Date:** December 1, 2025  
**Impact:** Admin payment methods management, checkout process
