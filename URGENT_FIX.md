# 🔧 URGENT FIX - Relationship Error

## The Problem
```
"Could not find a relationship between 'order_items' and 'menu_items'"
```

This means the foreign key constraint is missing.

## ✅ Quick Fix (1 minute)

### Step 1: Open Supabase SQL Editor
https://supabase.com/dashboard/project/csymdwzebhkfxjdyykrb/sql

### Step 2: Run This SQL
Copy ALL contents from: **`backend/complete-fix.sql`**

Paste and click **RUN**

### Step 3: Restart Your Backend
```bash
# Stop backend (Ctrl+C)
# Start again
cd backend
npm run dev
```

### Step 4: Restart Your App
```bash
# Stop app (Ctrl+C)
# Start again
cd cafe
npm run dev
```

## What This Does

✅ Creates `menu_items` table
✅ Creates `otps` table  
✅ Creates `app_settings` table
✅ **Fixes the foreign key relationship** (order_items → menu_items)
✅ Adds 10 sample menu items
✅ Refreshes Supabase schema cache

## After Running

Your app will work! No more errors:
- ✅ Orders will load
- ✅ Menu items will show
- ✅ OTP login will work
- ✅ Pause state will work

## Still Getting Errors?

1. Make sure you ran the COMPLETE SQL (all lines)
2. Restart BOTH backend and frontend
3. Clear app cache: Close and reopen Expo app
4. Check backend logs for any errors

## Verify It Worked

```bash
cd backend
node setup-database.js
```

Should show all ✅ green checkmarks.
