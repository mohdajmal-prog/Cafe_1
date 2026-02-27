# ✅ Quick Fix Summary

## The Problem
Your app is showing errors because 3 database tables are missing:
- ❌ `menu_items` 
- ❌ `otps`
- ❌ `app_settings`

## The Solution (2 Steps)

### Step 1: Run SQL Script

1. Open: https://supabase.com/dashboard/project/csymdwzebhkfxjdyykrb
2. Click: **SQL Editor** → **New Query**
3. Copy ALL contents from: `backend/fix-missing-tables.sql`
4. Paste and click **Run**

### Step 2: Verify

```bash
cd backend
node setup-database.js
```

You should see all ✅ green checkmarks.

## What This Does

✅ Creates `menu_items` table (for cafe menu)
✅ Creates `otps` table (for login codes)
✅ Creates `app_settings` table (for app pause state)
✅ Adds 5 sample menu items
✅ Sets up security policies
✅ Inserts default settings

## After Setup

Your app will work! You can:
- ✅ Send OTP codes
- ✅ Login with OTP
- ✅ View menu items
- ✅ Create orders
- ✅ Check pause state

## Files Created

- `fix-missing-tables.sql` - SQL to create missing tables
- `setup-database.js` - Script to check table status
- `DATABASE_SETUP.md` - Detailed setup guide

## Need More Help?

See `DATABASE_SETUP.md` for detailed instructions and troubleshooting.
