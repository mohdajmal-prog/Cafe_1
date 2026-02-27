# 🔧 Database Setup Guide

## Problem
Your Supabase database is missing these tables:
- ❌ `menu_items`
- ❌ `otps`
- ❌ `app_settings`

## Quick Fix (2 minutes)

### Option 1: Run SQL in Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/csymdwzebhkfxjdyykrb

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy and Run SQL**
   - Open file: `backend/fix-missing-tables.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click "Run" button

4. **Verify**
   - Run: `node setup-database.js` in backend folder
   - Should show all ✅ green checkmarks

### Option 2: Use Full Schema (If you want to recreate everything)

1. Open Supabase SQL Editor (same as above)
2. Copy contents from: `backend/config/schema.sql`
3. Paste and Run

## What Gets Created

### Tables
- ✅ `menu_items` - Store cafe menu items
- ✅ `otps` - Store OTP codes for authentication
- ✅ `app_settings` - Store app configuration (pause state, etc.)

### Sample Data
- 5 sample menu items (Coffee & Pastries)
- Default pause state (app not paused)

### Security
- Row Level Security (RLS) enabled
- Service role policies (your backend can access everything)

## Verify Setup

After running the SQL, test with:

```bash
cd backend
node setup-database.js
```

Expected output:
```
✅ users - exists
✅ menu_items - exists
✅ orders - exists
✅ order_items - exists
✅ otps - exists
✅ app_settings - exists

🎉 Database is ready!
```

## Test Your App

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm run dev` (in cafe folder)
3. Try logging in with OTP

## Troubleshooting

### Error: "Could not find the table"
- Tables don't exist → Run the SQL script

### Error: "permission denied"
- Check your SUPABASE_SERVICE_KEY in .env
- Make sure RLS policies are created

### Error: "relation already exists"
- Tables already exist → Safe to ignore
- Or drop tables first: `DROP TABLE IF EXISTS table_name CASCADE;`

## Need Help?

Run this to check status:
```bash
cd backend
node setup-database.js
```

This will tell you exactly which tables are missing.
