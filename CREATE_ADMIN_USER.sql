-- =============================================
-- CREATE ADMIN USER
-- =============================================
-- This script creates an admin user for Firewood USA
-- Email: usa@firewood.com
-- Password: Derq@038!
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pnqgzqzznesgamlwwcez
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" button
-- 4. Select "Create new user"
-- 5. Enter:
--    - Email: usa@firewood.com
--    - Password: Derq@038!
--    - Auto Confirm User: YES (check this box)
-- 6. Click "Create User"
-- 7. After user is created, run the SQL below in SQL Editor to make them an admin
-- =============================================

-- Update the user's role to admin in the profiles table
-- Replace 'usa@firewood.com' with the actual email if different
UPDATE profiles 
SET role = 'admin',
    full_name = 'Firewood USA Admin'
WHERE email = 'usa@firewood.com';

-- Verify the admin was created
SELECT id, email, role, full_name, created_at 
FROM profiles 
WHERE email = 'usa@firewood.com';

-- =============================================
-- ALTERNATIVE: If you need to create via SQL
-- =============================================
-- Note: This requires Supabase service role access
-- It's easier to create through the Dashboard UI

/*
-- 1. First, create the auth user (Dashboard only - cannot be done via SQL in public schema)
-- 2. Then update their profile to admin role with the SQL above
*/
