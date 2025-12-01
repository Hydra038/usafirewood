# Reset Password Troubleshooting Guide

## Problem: Reset Password Button Not Working

If the "Reset Password" button appears to be stalling or not doing anything, here's what's happening and how to fix it.

---

## How Password Reset Works

### The Correct Flow:

1. **User goes to Forgot Password page** (`/auth/forgot-password`)
2. **User enters their email**
3. **Supabase sends reset email** with a special link
4. **User clicks the link in email** → Opens `/auth/reset-password` with active session
5. **User enters new password**
6. **Password is updated** ✅

---

## Common Issues

### Issue 1: Button Stalling / Not Responding

**Cause:** User navigated directly to `/auth/reset-password` without clicking the email link.

**Why it happens:** 
- The reset password page requires an **active session** from the email link
- Without the email link, there's no session token to authorize the password change
- Supabase rejects the update because it can't verify the user's identity

**Solution:**
1. Go to **Forgot Password page**: `/auth/forgot-password`
2. Enter your email and submit
3. Check your inbox for reset email
4. Click the link in the email
5. NOW the reset password form will work

---

### Issue 2: "No active reset session" Error

**Cause:** The reset link expired or wasn't used.

**Token Expiration:**
- Reset password tokens expire after **1 hour**
- If you waited too long, the link is no longer valid

**Solution:**
1. Request a new reset link at `/auth/forgot-password`
2. Check email and click the link quickly
3. Set your new password within 1 hour

---

### Issue 3: Email Link Not Working

**Cause:** Redirect URLs not whitelisted in Supabase.

**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to Redirect URLs:
   ```
   http://localhost:3000/auth/reset-password
   https://your-domain.com/auth/reset-password
   ```
3. Save and wait 2 minutes
4. Request new reset email

---

## Testing the Full Flow

### Step-by-Step Test:

1. **Start at Forgot Password**
   - Go to: `http://localhost:3000/auth/forgot-password`
   - Enter a valid email from your database
   - Click "Send reset link"

2. **Check Your Email**
   - Look for email from Supabase
   - Subject: "Reset your password" (or similar)
   - Check spam folder if not in inbox

3. **Click the Email Link**
   - Should open: `/auth/reset-password?code=xxxxx`
   - This creates an active session

4. **Set New Password**
   - Enter new password (8+ characters)
   - Confirm password
   - Click "Reset password"
   - Should see success message

5. **Verify It Works**
   - Redirected to login page
   - Try logging in with new password
   - Should work! ✅

---

## Technical Details

### What Happens Behind the Scenes:

```typescript
// When user clicks email link:
/auth/reset-password?code=abc123
  ↓
Supabase exchanges code for session
  ↓
Session stored in browser
  ↓
User can now call updateUser()
```

### Without Email Link:

```typescript
// User goes directly to page:
/auth/reset-password
  ↓
No session exists
  ↓
updateUser() fails
  ↓
Button appears to do nothing
```

---

## Error Messages Explained

### "Invalid or expired reset link"
- The reset token is too old (>1 hour)
- Solution: Request a new reset email

### "No active reset session"
- You didn't click the email link
- Solution: Go to forgot password page and start over

### "Failed to reset password"
- Generic error from Supabase
- Check browser console (F12) for details
- Might be network issue or Supabase configuration

### "Passwords do not match"
- Your new password and confirm password don't match
- Solution: Type carefully and ensure both fields are identical

### "Password must be at least 8 characters"
- Password is too short
- Solution: Use a longer password (8+ characters)

---

## Debugging Tips

### Check Browser Console:

1. Press **F12** to open developer tools
2. Go to **Console** tab
3. Try resetting password again
4. Look for error messages
5. Common errors:
   - `Auth session missing!` → No email link clicked
   - `Invalid token` → Link expired
   - `Network error` → Internet connection issue

### Check Supabase Logs:

1. Go to Supabase Dashboard
2. Click **Authentication** → **Logs**
3. Filter by your email address
4. Look for errors related to password reset

---

## Best Practices

### For Users:

- ✅ Always use the forgot password link
- ✅ Click the email link within 1 hour
- ✅ Use a strong password (8+ characters)
- ✅ Confirm password matches
- ❌ Don't navigate directly to reset page
- ❌ Don't reuse old reset links

### For Developers:

- ✅ Whitelist all redirect URLs in Supabase
- ✅ Show clear error messages
- ✅ Check for active session before allowing reset
- ✅ Add link to request new reset
- ✅ Log errors for debugging
- ❌ Don't allow password reset without session

---

## Quick Fixes Checklist

If reset password isn't working:

- [ ] Did you click the link from the reset email?
- [ ] Is the email link less than 1 hour old?
- [ ] Are redirect URLs whitelisted in Supabase?
- [ ] Is your password at least 8 characters?
- [ ] Do both password fields match?
- [ ] Check browser console for errors (F12)
- [ ] Check Supabase auth logs for errors
- [ ] Try requesting a new reset email
- [ ] Test with incognito/private browsing

---

## Still Having Issues?

### Check These Files:

1. **Forgot Password Page**: `src/app/auth/forgot-password/page.tsx`
   - Sends reset email with correct redirect URL

2. **Reset Password Page**: `src/app/auth/reset-password/page.tsx`
   - Checks for active session
   - Shows helpful error messages
   - Updates password via Supabase

3. **Supabase Configuration**:
   - URL Configuration → Redirect URLs
   - Email Templates → Reset Password template

### Environment Variables:

Check `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://pnqgzqzznesgamlwwcez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

## Summary

**The button "stalls" because:**
- You need to click the email link first
- The email link creates an authenticated session
- Without that session, password reset is not allowed (security measure)

**To fix:**
1. Request reset email at `/auth/forgot-password`
2. Click the link in the email
3. NOW reset your password on the form

This is by design - it prevents unauthorized password changes! 🔒

---

**Last Updated:** December 2, 2025  
**Related Docs:** `EMAIL_VERIFICATION_FIX.md`, `SUPABASE_EMAIL_TEMPLATES.md`
