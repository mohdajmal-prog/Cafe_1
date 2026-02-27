require('dotenv').config();
const supabase = require('./config/supabase');

async function testPhoneOTP() {
  try {
    console.log('📱 Testing Phone OTP functionality...');
    
    const testPhone = '+1234567890';
    const testOTP = '654321';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Clear existing OTPs for test phone
    console.log('🧹 Clearing existing OTPs for test phone...');
    await supabase.from('otps').delete().eq('phone', testPhone);
    
    // Insert test phone OTP
    console.log('📝 Inserting phone OTP...');
    const { data: insertData, error: insertError } = await supabase
      .from('otps')
      .insert({
        phone: testPhone,
        otp: testOTP,
        expires_at: expiresAt.toISOString()
      })
      .select();
    
    console.log('Insert result:', { insertData, insertError });
    
    if (insertError) {
      console.error('❌ Failed to insert phone OTP:', insertError);
      return;
    }
    
    // Verify the phone OTP
    console.log('🔍 Verifying phone OTP...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', testPhone)
      .eq('otp', testOTP)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    console.log('Verify result:', { verifyData, verifyError });
    
    // Clean up
    await supabase.from('otps').delete().eq('phone', testPhone);
    console.log('✅ Phone OTP test completed and cleaned up');
    
  } catch (error) {
    console.error('❌ Phone OTP test failed:', error);
  }
}

testPhoneOTP();