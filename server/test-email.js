import dotenv from 'dotenv';
import { sendWelcomeEmail } from './emailService.js';

dotenv.config();

console.log('🔍 Email Notification Test\n');
console.log('='.repeat(50));

// Check configuration
console.log('\n1️⃣  Configuration Check:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET (PLACEHOLDER)'}`);
console.log(`   OWNER_NAME: ${process.env.OWNER_NAME || '❌ NOT SET'}`);

// Check if credentials are placeholders
const hasValidEmailConfig = process.env.EMAIL_USER &&
                           process.env.EMAIL_PASS &&
                           !process.env.EMAIL_PASS.includes('your_') &&
                           process.env.EMAIL_USER.includes('@');

console.log('\n2️⃣  Status:');
console.log(`   Email Configuration: ${hasValidEmailConfig ? '✅ READY' : '❌ INCOMPLETE'}`);

if (!hasValidEmailConfig) {
  console.log('\n❌ EMAIL WILL NOT SEND - CONFIGURATION INCOMPLETE\n');
  console.log('Required steps:');
  console.log('1. Get Gmail App Password from: https://myaccount.google.com/apppasswords');
  console.log('2. Update EMAIL_PASS in .env file');
  console.log('3. Restart server');
  process.exit(1);
}

// Test email sending
console.log('\n3️⃣  Testing Email Send:');
console.log('   Sending test welcome email...\n');

(async () => {
  try {
    const result = await sendWelcomeEmail(
      'pavankalyan.chintapoodi@gmail.com',
      'Test Member',
      'Premium',
      process.env.OWNER_NAME || 'Gym Owner'
    );

    if (result) {
      console.log('✅ EMAIL TEST PASSED!');
      console.log('   Email should arrive in your inbox within 1-2 minutes.');
      console.log('   Check spam folder if not found in inbox.');
    } else {
      console.log('❌ EMAIL SEND FAILED');
      console.log('   Check your Gmail credentials in .env');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('Test Complete\n');
  process.exit(0);
})();
