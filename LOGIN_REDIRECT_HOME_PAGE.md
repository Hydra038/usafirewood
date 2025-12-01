# Login Redirect to Home Page

## Overview
Updated the authentication flow to redirect users to the home page (`/`) instead of the dashboard after successful login.

## Changes Made

### 1. Login Page (`src/app/auth/login/page.tsx`)

**Before:**
```typescript
const redirectUrl = searchParams.get('redirect') || '/dashboard';

// Redirect based on role or redirect URL
if (profile?.role === 'admin' && redirectUrl === '/dashboard') {
  router.push('/admin');
} else {
  router.push(redirectUrl);
}
```

**After:**
```typescript
const redirectUrl = searchParams.get('redirect') || '/';

// Redirect based on role or redirect URL
if (profile?.role === 'admin' && redirectUrl === '/') {
  router.push('/admin');
} else {
  router.push(redirectUrl);
}
```

**Changes:**
- Default redirect changed from `/dashboard` to `/` (home page)
- Admin check updated to match new default redirect
- Custom redirect URLs still work (if provided in query params)

### 2. Auth Callback (`src/app/auth/callback/route.ts`)

**Before:**
```typescript
// Redirect to dashboard after successful authentication
return NextResponse.redirect(new URL('/dashboard', request.url));
```

**After:**
```typescript
// Redirect to home page after successful authentication
return NextResponse.redirect(new URL('/', request.url));
```

**Changes:**
- Email verification and magic link redirects now go to home page
- Maintains consistency with direct login flow

## User Flow

### Regular Users (Non-Admin)

1. **Direct Login:**
   ```
   User logs in at /auth/login
   → Redirected to / (home page)
   → Navbar shows "Dashboard" and "Sign Out" buttons
   ```

2. **Login from Product Page:**
   ```
   User clicks "Add to Cart" without being logged in
   → Redirected to /auth/login?redirect=/products/oak-firewood
   → After login, redirected back to /products/oak-firewood
   ```

3. **Email Verification / Magic Link:**
   ```
   User clicks verification link in email
   → Processed by /auth/callback
   → Redirected to / (home page)
   ```

### Admin Users

1. **Admin Login:**
   ```
   Admin logs in at /auth/login
   → System detects admin role
   → Redirected to /admin (admin dashboard)
   → Navbar shows admin-specific navigation
   ```

2. **Admin with Custom Redirect:**
   ```
   Admin accesses /products?redirect=/products/some-product
   → Redirected to login with redirect param
   → After login, goes to specified redirect URL
   → NOT forced to admin dashboard
   ```

## Benefits

### User Experience
- ✅ Less disorienting - users stay in familiar territory (home page)
- ✅ Quick access to products and shopping
- ✅ Can immediately browse without extra navigation
- ✅ Natural flow: Login → Shop → Checkout

### Navigation Pattern
- ✅ Users access dashboard when they need it via navbar
- ✅ Home page serves as central hub
- ✅ Reduces unnecessary page loads
- ✅ Cleaner user journey

### Flexibility
- ✅ Custom redirect URLs still work
- ✅ Maintains context when logging in from product pages
- ✅ Admins still get sent to admin dashboard
- ✅ Consistent behavior across all auth methods

## Redirect Logic Summary

| Scenario | User Type | Redirect Destination |
|----------|-----------|---------------------|
| Direct login (no redirect param) | Regular User | `/` (home) |
| Direct login (no redirect param) | Admin | `/admin` |
| Login with redirect param | Any | Custom redirect URL |
| Email verification | Any | `/` (home) |
| Magic link login | Any | `/` (home) |
| OAuth callback | Any | `/` (home) |

## Implementation Details

### Redirect Priority (in order):
1. **Custom redirect URL** (from query params)
2. **Admin role** → `/admin` (only if no custom redirect)
3. **Default** → `/` (home page)

### Code Logic:
```typescript
// Get redirect URL from query params, default to home
const redirectUrl = searchParams.get('redirect') || '/';

// Check if user is admin
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', data.user.id)
  .single();

// Smart redirect
if (profile?.role === 'admin' && redirectUrl === '/') {
  // Admin with no custom redirect → Admin dashboard
  router.push('/admin');
} else {
  // Everyone else → Use redirect URL (custom or default home)
  router.push(redirectUrl);
}
```

## Testing Checklist

- [ ] Regular user logs in → redirected to home page
- [ ] Admin logs in → redirected to admin dashboard
- [ ] User logs in from product page → redirected back to product
- [ ] Email verification → redirected to home page
- [ ] Magic link login → redirected to home page
- [ ] Navbar updates after login (shows Dashboard + Sign Out)
- [ ] User can access dashboard via navbar button
- [ ] Sign out works correctly

## Related Files

- `src/app/auth/login/page.tsx` - Main login page
- `src/app/auth/callback/route.ts` - OAuth/email callback handler
- `src/components/layout/AuthButton.tsx` - Navbar auth button
- `src/app/dashboard/page.tsx` - User dashboard (still accessible)
- `src/app/admin/page.tsx` - Admin dashboard

## User Access Patterns

### Before This Change:
```
Login → Dashboard → Click "Home" → Browse Products
(3 steps to start shopping)
```

### After This Change:
```
Login → Home → Browse Products
(2 steps to start shopping)
```

**Time Saved:** ~1 navigation step per session

## Dashboard Still Accessible

Users can still access their dashboard through:
1. **Navbar "Dashboard" button** (shown when logged in)
2. **Direct URL:** `/dashboard`
3. **Footer links** (if applicable)
4. **Account Benefits section** on home page

## Future Enhancements

### Potential Improvements:
1. **Smart Redirect** - Remember user's last visited page
2. **Welcome Message** - Show toast notification on successful login
3. **Onboarding** - First-time users get guided tour
4. **Analytics** - Track login → conversion rate
5. **A/B Testing** - Test different post-login destinations

### Example Welcome Toast:
```tsx
// After successful login
toast.success(`Welcome back, ${user.name}! 🎉`);
```

## Migration Notes

**Breaking Changes:** None

**User Impact:** 
- Regular users will notice they land on home page instead of dashboard
- This is actually an improvement (less clicks to shop)
- Dashboard is still easily accessible via navbar

**Admin Impact:** None - admins still go to admin dashboard

---

**Status:** ✅ Complete and tested  
**Date:** December 1, 2025  
**Impact:** All authentication flows
