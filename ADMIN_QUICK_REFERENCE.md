# Quick Reference - Admin Access

## 🔥 Favicon
- **Created:** Custom firewood logo with flame (SVG)
- **File:** `public/favicon.svg`
- **Auto-detected by Next.js 15** - No manual linking needed!
- **Note:** The emoji-based PNG favicons caused Windows path errors, so we're using the SVG which works perfectly

## 🔐 Admin Login Credentials

**Email:** `usa@firewood.com`  
**Password:** `Derq@038!`

## 📝 How to Create Admin User

### Quick Steps:

1. **Go to Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
   ```

2. **Authentication → Users → Add User**
   - Email: `usa@firewood.com`
   - Password: `Derq@038!`
   - ✅ Check "Auto Confirm User"
   - Click "Create User"

3. **Set as Admin (SQL Editor)**
   ```sql
   UPDATE profiles 
   SET role = 'admin', full_name = 'Firewood USA Admin'
   WHERE email = 'usa@firewood.com';
   ```

4. **Test Login**
   - Go to http://localhost:3001/auth/login
   - Login with credentials above
   - You should see "Admin" link in navbar

## 🎯 Admin Access URLs

After login as admin:
- **Admin Dashboard:** `/admin`
- **Manage Products:** `/admin/products`
- **Manage Orders:** `/admin/orders`
- **Payment Methods:** `/admin/payment-methods`
- **Manage Users:** `/admin/users`

## 📄 Documentation Files Created

1. **ADMIN_SETUP_GUIDE.md** - Complete setup instructions
2. **CREATE_ADMIN_USER.sql** - SQL scripts for admin creation
3. **ADMIN_QUICK_REFERENCE.md** - This file

## ✅ Verification Checklist

- [ ] Favicon appears in browser tab
- [ ] Admin user created in Supabase
- [ ] Can log in with `usa@firewood.com`
- [ ] "Admin" link visible in navbar after login
- [ ] Can access `/admin` dashboard
- [ ] Can view/edit products
- [ ] Can view all orders

---

**Need help?** See `ADMIN_SETUP_GUIDE.md` for detailed instructions and troubleshooting.
