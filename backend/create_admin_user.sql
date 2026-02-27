-- ============================================
-- ADMIN USER SETUP SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor

-- Option 1: Make existing user an admin
-- Replace '+91XXXXXXXXXX' with actual phone number
UPDATE users 
SET is_admin = true 
WHERE phone = '+91XXXXXXXXXX';

-- Option 2: Create new admin user
-- Uncomment and modify the values below
/*
INSERT INTO users (name, phone, is_admin, email)
VALUES ('Admin Name', '+91XXXXXXXXXX', true, 'admin@cafe.com');
*/

-- Verify admin user was created
SELECT id, name, phone, email, is_admin, created_at 
FROM users 
WHERE is_admin = true;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Admin users have is_admin = true
-- 2. They can login via OTP like regular users
-- 3. Only admins can access admin panel
-- 4. Regular users will get "Not authorized" error
