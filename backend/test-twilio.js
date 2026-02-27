require('dotenv').config();
const twilio = require('twilio');

console.log('Testing Twilio credentials...');
console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN ? '***' + process.env.TWILIO_AUTH_TOKEN.slice(-4) : 'NOT SET');
console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER);

try {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log('\n✅ Twilio client initialized successfully');
  
  // Test by fetching account info
  client.api.accounts(process.env.TWILIO_ACCOUNT_SID)
    .fetch()
    .then(account => {
      console.log('✅ Twilio credentials are VALID');
      console.log('Account Status:', account.status);
      console.log('Account Type:', account.type);
    })
    .catch(error => {
      console.error('❌ Twilio credentials are INVALID');
      console.error('Error:', error.message);
      console.error('Code:', error.code);
    });
} catch (error) {
  console.error('❌ Failed to initialize Twilio client:', error.message);
}
