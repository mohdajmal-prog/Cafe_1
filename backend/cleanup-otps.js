require('dotenv').config();
const supabase = require('./config/supabase');

async function cleanupInvalidOTPs() {
  try {
    console.log('🧹 Cleaning up invalid OTP records...');
    
    // Delete OTPs where both email and phone are null
    const { data, error } = await supabase
      .from('otps')
      .delete()
      .is('email', null)
      .is('phone', null)
      .select();
    
    if (error) {
      console.error('❌ Error cleaning up OTPs:', error);
    } else {
      console.log(`✅ Cleaned up ${data?.length || 0} invalid OTP records`);
    }
    
    // Show remaining OTPs
    const { data: remainingOTPs } = await supabase
      .from('otps')
      .select('*')
      .limit(10);
    
    console.log('📋 Remaining OTPs:', remainingOTPs);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupInvalidOTPs();