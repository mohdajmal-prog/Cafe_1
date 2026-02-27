const admin = require('firebase-admin');

// Initialize Firebase Admin without service account (using environment)
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'melody-6c1e7'
    });
  }
} catch (error) {
  console.log('⚠️ Firebase Admin not initialized:', error.message);
}

module.exports = admin;
