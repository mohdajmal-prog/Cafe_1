# 🚀 QUICK START - ADMIN PANEL

## 1. Setup Admin User (One-time)
Open Supabase SQL Editor and run:
```sql
UPDATE users SET is_admin = true WHERE phone = '+91XXXXXXXXXX';
```

## 2. Start Backend
```bash
cd backend
npm start
```
✅ Should show: Server running on http://10.181.194.35:3006

## 3. Start Admin App
```bash
cd cafe_admin
npm start
```
Or double-click: `start_admin.bat`

## 4. Login
- Enter admin phone number
- Enter OTP from SMS
- ✅ Access granted!

---

## 📱 FEATURES QUICK GUIDE

### Menu Tab (Home)
- **View**: All products listed
- **Add**: Click "+" button → Fill form → Save
- **Edit**: Click "Edit" on any product
- **Delete**: Click "Delete" → Confirm
- **Sync**: Changes appear in student app instantly

### Orders Tab
- **View**: All paid orders
- **Refresh**: Pull down to refresh
- **Details**: Order ID, customer, items, total

### Scanner Tab
- **Scan**: Tap screen to activate camera
- **Show**: Student shows QR from their app
- **Result**: Bill details if paid, "No data found" if not

### Analytics Tab
- **Filter**: Week / Month / Year
- **View**: Top products by revenue
- **Data**: Units sold + revenue per product

---

## 🔧 TROUBLESHOOTING

### Can't Login
→ Check `is_admin = true` in database
→ Verify backend is running

### Camera Not Working
→ Grant camera permission
→ Restart app

### Products Not Syncing
→ Check backend WebSocket logs
→ Restart both apps

### Wrong IP
→ Update in `cafe_admin/src/constants/api.ts`
```typescript
const MANUAL_IP = 'YOUR_IP_HERE';
```

---

## 📋 TESTING FLOW

1. ✅ Login with admin credentials
2. ✅ Add product: "Test Item" - ₹50
3. ✅ Check student app - should appear
4. ✅ Create order in student app
5. ✅ Scan QR in admin scanner
6. ✅ View analytics

---

## 📞 NEED HELP?

Check these files:
- `ADMIN_SETUP.md` - Detailed setup
- `ADMIN_IMPLEMENTATION.md` - Full documentation
- `cafe_admin/README.md` - Feature guide

Check logs:
- Backend: Terminal window
- Admin App: Expo console
- Database: Supabase dashboard

---

## ✨ YOU'RE ALL SET!

Admin panel is ready to use. Start managing your cafe! 🎉
