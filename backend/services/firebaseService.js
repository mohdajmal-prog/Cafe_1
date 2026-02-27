// Firebase OTP Service (console-based for development)
class FirebaseOTPService {
  async sendOTP(toPhoneNumber, otp) {
    console.log(`\n🔥 Firebase OTP`);
    console.log(`📱 Phone: ${toPhoneNumber}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`⏰ Valid for 10 minutes\n`);
    return { success: true };
  }

  async sendOrderConfirmation(toPhoneNumber, orderId, totalAmount) {
    console.log(`📱 Order #${orderId} confirmed for ${toPhoneNumber} - ₹${totalAmount}`);
    return { success: true };
  }

  async sendOrderStatus(toPhoneNumber, orderId, status) {
    console.log(`📱 Order #${orderId} status: ${status} - ${toPhoneNumber}`);
    return { success: true };
  }
}

module.exports = new FirebaseOTPService();
