# 📱 ENABLE REAL SMS OTP - QUICK GUIDE

## ✅ Packages Installed
- `expo-firebase-recaptcha` ✓
- `firebase` ✓

## 🔥 Enable Firebase Phone Auth (REQUIRED)

### Step 1: Go to Firebase Console
https://console.firebase.google.com/project/melody-6c1e7/authentication/providers

### Step 2: Enable Phone Sign-In
1. Click on **Phone** provider
2. Toggle **Enable**
3. Click **Save**

### Step 3: Add Your App to Firebase (Android/iOS)

**For Android:**
1. Go to Project Settings → Your apps
2. Add Android app or select existing
3. Download `google-services.json`
4. Place in `cafe/android/app/`

**For iOS:**
1. Go to Project Settings → Your apps
2. Add iOS app or select existing
3. Download `GoogleService-Info.plist`
4. Place in `cafe/ios/`

### Step 4: Configure SHA-256 (Android Only)

Get SHA-256 certificate:
```bash
cd cafe/android
./gradlew signingReport
```

Add SHA-256 to Firebase Console → Project Settings → Your apps → Android app

## 🧪 Testing with Test Phone Numbers

Add test numbers in Firebase Console (no SMS sent):

1. Authentication → Sign-in method → Phone
2. Scroll to **Phone numbers for testing**
3. Add:
   - Phone: `+91 1234567890`
   - Code: `123456`

## 📝 Current Status

**✅ Installed:**
- Firebase SDK
- reCAPTCHA verifier

**⏳ Required:**
- Enable Phone Auth in Firebase Console
- Add app to Firebase project (for production)

**🎯 For Development:**
- Use test phone numbers (no real SMS)
- OTP still logged to backend console

## 🚀 After Enabling

Once Phone Auth is enabled in Firebase Console:
- Real SMS will be sent automatically
- Free tier: 10,000 verifications/month
- Works globally

## 💡 Quick Test

1. Enable Phone Auth in Firebase Console
2. Add test number: +91 1234567890 → OTP: 123456
3. Use in app - no real SMS, instant verification
4. For real numbers - SMS sent automatically

---

**Enable now:** https://console.firebase.google.com/project/melody-6c1e7/authentication/providers
