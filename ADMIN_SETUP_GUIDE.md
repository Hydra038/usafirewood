# Admin Setup Guide

## Admin Account Details

**Email:** `usa@firewood.com`  
**Password:** `Derq@038!`  
**Role:** Admin

## How to Create the Admin User

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
   - Navigate to **Authentication** → **Users**

2. **Create New User**
   - Click the **"Add User"** button (top right)
   - Select **"Create new user"**
   - Fill in the form:
     - **Email:** `usa@firewood.com`
     - **Password:** `Derq@038!`
     - **Auto Confirm User:** ✅ **CHECK THIS BOX** (Important!)
   - Click **"Create User"**

3. **Set Admin Role**
   - After user is created, go to **SQL Editor** in Supabase Dashboard
   - Run this query:
   ```sql
   UPDATE profiles 
   SET role = 'admin',
       full_name = 'Firewood USA Admin'
   WHERE email = 'usa@firewood.com';
   ```

4. **Verify Admin Access**
   - Go to your app: http://localhost:3001
   - Click **"Login"** in the navigation
   - Enter:
     - Email: `usa@firewood.com`
     - Password: `Derq@038!`
   - After login, you should see **"Admin"** link in the navigation

### Method 2: Using SQL Script

If you prefer, you can use the `CREATE_ADMIN_USER.sql` file that was just created in your project root.

## Admin Features

Once logged in as admin, you'll have access to:

- **Admin Dashboard** (`/admin`)
  - View all orders
  - Manage products (create, edit, delete)
  - Manage payment methods
  - Manage users
  - View analytics

- **Admin Navigation**
  - The navbar will show an "Admin" link when logged in as admin
  - Regular users won't see this link

## Verification Steps

After creating the admin user, verify everything works:

1. ✅ User can log in with `usa@firewood.com` and `Derq@038!`
2. ✅ "Admin" link appears in navigation after login
3. ✅ Can access `/admin` dashboard
4. ✅ Can view and manage products at `/admin/products`
5. ✅ Can view all orders at `/admin/orders`
6. ✅ Can manage payment methods at `/admin/payment-methods`
7. ✅ Can manage users at `/admin/users`

## Troubleshooting

### User can log in but doesn't have admin access

Run this query in Supabase SQL Editor:

```sql
-- Check user's current role
SELECT id, email, role FROM profiles WHERE email = 'usa@firewood.com';

-- If role is not 'admin', update it:
UPDATE profiles SET role = 'admin' WHERE email = 'usa@firewood.com';
```

### User not found in profiles table

The `handle_new_user()` trigger should automatically create a profile when a user signs up. If it didn't work, manually create the profile:

```sql
-- Get the user ID from auth.users
SELECT id FROM auth.users WHERE email = 'usa@firewood.com';

-- Insert profile with admin role (replace USER_ID with the actual ID)
INSERT INTO profiles (id, email, role, full_name)
VALUES ('USER_ID', 'usa@firewood.com', 'admin', 'Firewood USA Admin');
```

### Email not confirmed

If you forgot to check "Auto Confirm User", run:

```sql
-- This needs to be run in SQL Editor with proper access
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'usa@firewood.com';
```

## Security Notes

- This password (`Derq@038!`) is set in documentation. Consider changing it after first login.
- Store admin credentials securely (password manager recommended)
- Don't commit this file to public repositories
- Consider enabling 2FA for admin accounts in production

## Next Steps

After creating the admin user:

1. Log in and test all admin features
2. Create/update products via admin dashboard
3. Configure payment methods
4. Test the complete order flow
5. Consider changing the admin password for production use
