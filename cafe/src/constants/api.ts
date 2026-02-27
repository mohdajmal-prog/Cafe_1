import Constants from 'expo-constants';

// ⚠️ REPLACE THIS WITH YOUR COMPUTER'S IP IF AUTOMATIC DETECTION FAILS
const MANUAL_IP = '10.200.66.35'; // 👈 Only needed if you are NOT using the tunnel and have connection issues.

// When running on a physical device, `Constants.manifest.debuggerHost`
// contains the dev machine IP (e.g. "192.168.1.5:19000"). Use that IP so the
// device can reach the backend running on the host machine. Fall back to
// localhost for web or simulator use.
const getHost = () => {
  if (MANUAL_IP) return MANUAL_IP;

  try {
    // Check for Expo Go (SDK 50+) host URI
    if (Constants.expoConfig?.hostUri) {
      return Constants.expoConfig.hostUri.split(':')[0];
    }

    const dbg = (Constants.manifest && (Constants.manifest as any).debuggerHost) || (Constants.manifest2 && (Constants.manifest2 as any).developer && (Constants.manifest2 as any).developer.hostUri);
    if (dbg && typeof dbg === 'string') {
      return dbg.split(':')[0];
    }
  } catch (e) {
    // ignore
  }
  return 'localhost';
};

export const API_BASE_URL = `http://${getHost()}:3006`;
console.log('🚀 API Configured URL:', API_BASE_URL);

export const ENDPOINTS = {
  MENU: "/menu",
  ITEMS: "/items",
  ORDERS: "/orders",
  PROFILE: "/user/profile",
  SEARCH: "/search",
  CATEGORIES: "/categories",
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  ADMIN_PAUSE: "/admin/pause",
};

export const MOCK_DELAY = 500; // ms
