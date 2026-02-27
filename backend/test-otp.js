require('dotenv').config();
const supabase = require('./config/supabase');

async function testOTP() {
  try {
    console.log('🧪 Testing OTP functionality...');
    
    // Test 1: Check current OTP table structure
    console.log('\n1. Checking OTP table structure...');
    const { data: otps, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .limit(5);
    
    console.log('Current OTPs in database:', otps);
    if (otpError) console.log('OTP query error:', otpError);
    
    // Test 2: Generate and save a test OTP
    console.log('\n2. Testing OTP generation...');
    const testEmail = 'test@example.com';
    const testOTP = '123456';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Clear existing OTPs for test email
    await supabase.from('otps').delete().eq('email', testEmail);
    
    // Insert test OTP
    const { data: insertData, error: insertError } = await supabase
      .from('otps')
      .insert({
        email: testEmail,
        otp: testOTP,
        expires_at: expiresAt.toISOString()
      })
      .select();
    
    console.log('Insert result:', { insertData, insertError });
    
    // Test 3: Verify the OTP
    console.log('\n3. Testing OTP verification...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('otps')
      .select('*')
      .eq('email', testEmail)
      .eq('otp', testOTP)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    console.log('Verify result:', { verifyData, verifyError });
    
    // Clean up
    await supabase.from('otps').delete().eq('email', testEmail);
    console.log('\n✅ Test completed and cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOTP();