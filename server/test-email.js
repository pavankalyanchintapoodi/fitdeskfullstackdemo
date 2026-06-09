import dotenv from 'dotenv';
import { sendWelcomeEmail } from './emailService.js';

dotenv.config();

console.log('🔍 Email Notification Test\n');
console.log('='.repeat(50));

// Check configuration
console.log('\n1️⃣  Configuration Check:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET (PLACEHOLDER)'}`);
console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   SENDGRID_FROM: ${process.env.SENDGRID_FROM || '(not set)'} `);
console.log(`   OWNER_NAME: ${process.env.OWNER_NAME || '❌ NOT SET'}`);

// Check if credentials are placeholders
// Valid if SendGrid key is present OR Gmail SMTP credentials look valid
const hasValidEmailConfig = (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM) || (
                           process.env.EMAIL_USER &&
                           process.env.EMAIL_PASS &&
                           !process.env.EMAIL_PASS.includes('your_') &&
                           process.env.EMAIL_USER.includes('@')
                         );

console.log('\n2️⃣  Status:');
console.log(`   Email Configuration: ${hasValidEmailConfig ? '✅ READY' : '❌ INCOMPLETE'}`);

if (!hasValidEmailConfig) {
  console.log('\n❌ EMAIL WILL NOT SEND - CONFIGURATION INCOMPLETE\n');
  console.log('Required steps:');
  console.log('A. Using SendGrid (recommended on Render):');
  console.log('   1. Sign up at https://sendgrid.com and create an API key');
  console.log('   2. Add SENDGRID_API_KEY and SENDGRID_FROM to server/.env');
  console.log('B. Or using Gmail SMTP (requires App Password):');
  console.log('   1. Get Gmail App Password from: https://myaccount.google.com/apppasswords');
  console.log('   2. Update EMAIL_PASS in .env file');
  console.log('   3. Restart server');
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
