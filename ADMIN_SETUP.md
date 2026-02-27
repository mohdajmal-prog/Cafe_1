# 🚀 ADMIN PANEL SETUP GUIDE

## ✅ Setup Complete!

Your admin panel is ready. Follow these steps to start using it:

## 1️⃣ Create Admin User

Run this SQL in Supabase:
```sql
-- Make existing user an admin
UPDATE users 
SET is_admin = true 
WHERE phone = '+91XXXXXXXXXX';  -- Replace with your phone number

-- Or create new admin user
INSERT INTO users (name, phone, is_admin)
VALUES ('Admin Name', '+91XXXXXXXXXX', true);
```

## 2️⃣ Start Backend

```bash
cd backend
npm start
```

Backend should run on: http://10.181.194.35:3006

## 3️⃣ Start Admin App

```bash
cd cafe_admin
npm start
```

Or double-click: `start_admin.bat`

## 4️⃣ Login

1. Open admin app
2. Enter admin phone number
3. Enter OTP received
4. Access granted!

## 📋 Features Overview

### Menu Tab
- View all products
- Click "+" to add new product
- Edit/Delete existing products
- Changes sync to student app in real-time

### Orders Tab
- View all paid orders
- Pull down to refresh
- See order details, items, customer info

### Scanner Tab
- Tap to scan QR code
- Student shows QR from their app
- View bill if order is paid
- "No data found" if not paid

### Analytics Tab
- Switch between Week/Month/Year
- See top-selling products
- View units sold and revenue

## 🔧 Configuration

If connection fails, update IP in:
`cafe_admin/src/constants/api.ts`

```typescript
const MANUAL_IP = '10.181.194.35'; // Your IP
```

## 🎯 Test Flow

1. **Add Product**: Menu tab → "+" → Fill form → Save
2. **Check Student App**: Product appears automatically
3. **Create Order**: Student app → Add to cart → Pay
4. **Scan QR**: Scanner tab → Scan student's QR → View bill
5. **View Analytics**: Analytics tab → Select period → See stats

## 📱 Running on Device

```bash
cd cafe_admin
npm start
# Scan QR code with Expo Go app
```

## 🐛 Common Issues

**"Not authorized as admin"**
- User doesn't have `is_admin = true` in database

**"Failed to load menu"**
- Backend not running
- Wrong IP address in api.ts

**Camera not working**
- Grant camera permission when prompted
- Check app.json has camera permissions

**Products not syncing**
- Check WebSocket connection
- Restart both apps

## 📞 Support

Check logs:
- Backend: Terminal running `npm start`
- Admin App: Expo console
- Database: Supabase dashboard

## ✨ You're All Set!

Start the backend and admin app, then login with your admin credentials.
