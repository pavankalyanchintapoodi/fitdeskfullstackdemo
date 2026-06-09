#!/usr/bin/env node

import dotenv from 'dotenv';
import { sendWelcomeEmail } from './emailService.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

console.log('\n🧪 Email Notification Tester\n');
console.log('='.repeat(60));

// Check configuration
console.log('\n📋 Configuration Check:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   OWNER_NAME: ${process.env.OWNER_NAME || '❌ NOT SET'}`);
console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   SENDGRID_FROM: ${process.env.SENDGRID_FROM || '(not set)'} `);

// Check if credentials are valid: accept SendGrid or Gmail app password
const hasValidEmailConfig = (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM) || (
                           process.env.EMAIL_USER &&
                           process.env.EMAIL_PASS &&
                           !process.env.EMAIL_PASS.includes('your_') &&
                           process.env.EMAIL_USER.includes('@')
                         );

console.log('\n✨ Status:');
console.log(`   Email: ${hasValidEmailConfig ? '✅ READY' : '❌ INCOMPLETE'}`);

if (!hasValidEmailConfig) {
  console.log('\n❌ EMAIL CONFIG INCOMPLETE!\n');
  console.log('A. Recommended (SendGrid on platforms like Render):');
  console.log('   1. Create an API key at https://sendgrid.com');
  console.log('   2. Add SENDGRID_API_KEY and SENDGRID_FROM to server/.env');
  console.log('B. Or Gmail App Password:');
  console.log('   1. Get Gmail App Password: https://myaccount.google.com/apppasswords');
  console.log('   2. Edit: nano server/.env');
  console.log('   3. Add: EMAIL_USER=your-email@gmail.com');
  console.log('   4. Add: EMAIL_PASS=your_16_char_app_password');
  console.log('   5. Restart server\n');
  rl.close();
  process.exit(1);
}

(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('\n📧 EMAIL TEST\n');

  const testEmail = await question('Enter email to receive test (default: owner@gym.com): ') || 'owner@gym.com';
  const testName = await question('Enter member name (default: Test Member): ') || 'Test Member';
  const testPlan = await question('Enter plan type (default: Premium): ') || 'Premium';

  console.log('\n⏳ Sending test email to:', testEmail);

  try {
    const emailResult = await sendWelcomeEmail(
      testEmail,
      testName,
      testPlan,
      process.env.OWNER_NAME || 'Gym Owner'
    );

    if (emailResult) {
      console.log('✅ EMAIL SENT!');
      console.log('   Check your inbox in 1-2 minutes');
      console.log('   (Check spam folder too)');
    } else {
      console.log('❌ EMAIL FAILED');
      console.log('   Check your Gmail app password in .env');
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Test Complete!\n');

  rl.close();
  process.exit(0);
})();
