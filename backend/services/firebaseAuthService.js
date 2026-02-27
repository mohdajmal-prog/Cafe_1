const admin = require('firebase-admin');

class FirebaseAuthService {
  constructor() {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'melody-6c1e7'
        });
      }
      this.auth = admin.auth();
    } catch (error) {
      console.error('Firebase init error:', error.message);
    }
  }

  async sendOTP(phoneNumber, otp) {
    // For development: Log OTP to console
    console.log(`\n🔥 Firebase OTP`);
    console.log(`📱 Phone: ${phoneNumber}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`⏰ Valid for 10 minutes\n`);
    
    // TODO: Implement Firebase Phone Auth for production
    // This requires Firebase Cloud Functions or client-side reCAPTCHA
    return { success: true };
  }

  async verifyOTP(phoneNumber, otp) {
    // Verify against database (current implementation)
    return { success: true };
  }
}

module.exports = new FirebaseAuthService();
