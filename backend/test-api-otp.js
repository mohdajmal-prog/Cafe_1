// Test OTP verification directly
const testOTPVerification = async () => {
  try {
    const response = await fetch('http://localhost:3006/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '7603996934',
        otp: '880789',
        name: 'Test User'
      })
    });

    const result = await response.json();
    console.log('API Response:', result);
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Run the test
testOTPVerification();