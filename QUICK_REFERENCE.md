# ⚡ Email/SMS Setup - Quick Reference Card

Print this or keep it in a terminal window!

---

## 📧 Gmail Setup (5 minutes)

### Get App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select: Mail + macOS
3. Get 16-character password ← **COPY THIS**

### Update .env File
```bash
nano /Users/indu/Documents/gymapp-folder/server/.env
```

Add (or update):
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abc123defghi4567
OWNER_NAME=Your Gym Name
OWNER_EMAIL=your-email@example.com
```

Save: `Ctrl+X` → `Y` → `Enter`

---

## 🧪 Test Email

### Automatic Test
```bash
cd /Users/indu/Documents/gymapp-folder/server
npm run test-email:interactive
```

Follow prompts. Check email in 2 minutes.

### Manual Test via App
1. Start: `npm run dev` (in `/Users/indu/Documents/gymapp-folder`)
2. Open: http://localhost:5173
3. Login: `owner@gym.com` / `password123`
4. Add member with YOUR email
5. Check email (spam folder too)

---

## 📱 Twilio Setup (Optional)

### Get Credentials
1. Sign up: https://www.twilio.com/
2. Copy: Account SID, Auth Token, Phone Number

### Install & Configure
```bash
cd /Users/indu/Documents/gymapp-folder/server
npm install twilio
```

Edit `.env`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx...
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🚀 Everything at a Glance

| Step | Command | What to Expect |
|------|---------|---------|
| 1. Setup Gmail | Edit `.env` | EMAIL_USER, EMAIL_PASS set |
| 2. Start server | `npm run dev` | Server on http://localhost:3000 |
| 3. Test | `npm run test-email:interactive` | "✅ EMAIL SENT!" |
| 4. Check email | Check inbox | Welcome email received |
| 5. Add member | Use app | Email sent automatically |
| 6. Verify | Check logs | `✅ Welcome email sent to:...` |

---

## 🔍 Troubleshooting Commands

### Check Configuration
```bash
cat /Users/indu/Documents/gymapp-folder/server/.env
```

### Check Email/SMS in Logs
```bash
# Kill current server: Press Ctrl+C
npm run dev 2>&1 | grep -i "email\|sms\|welcome"
```

### Verify Nodemailer Working
```bash
node -e "
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((err, success) => {
  if (err) console.log('❌ ERROR:', err);
  else console.log('✅ Gmail connection OK');
  process.exit(0);
});
"
```

### Reset Database
```bash
cd /Users/indu/Documents/gymapp-folder/server
rm gym_tracker.db
npm run seed
```

---

## 📋 Status Checklist

```
Gmail Setup:
  [ ] Email address set in .env
  [ ] App password (16 chars) in .env
  [ ] 2-Step Verification enabled
  [ ] No placeholder text in .env

Email Test:
  [ ] npm run test-email:interactive works
  [ ] Test email received
  [ ] Email not in spam folder

App Test:
  [ ] Server running: npm run dev
  [ ] Can login: owner@gym.com
  [ ] Can add member
  [ ] Member email in log: ✅ Welcome email sent to:
  [ ] Receive email in inbox

SMS Setup (Optional):
  [ ] Twilio account created
  [ ] Credentials in .env
  [ ] npm install twilio completed
  [ ] Phone number verified
  [ ] SMS test received
```

---

## 🎯 Key Files

```
Docs:
  📄 EMAIL_SMS_GUIDE.md ......... Full walkthrough
  📄 SETUP_CHECKLIST.md ........... Step-by-step
  📄 EMAIL_WORKFLOW.md .......... Visual diagram
  📄 TROUBLESHOOTING.md ......... Common issues

Config:
  ⚙️ server/.env ..................... Credentials
  ⚙️ server/emailService.js .... Email/SMS functions
  ⚙️ server/server.js ............ Main server file

Scripts:
  🧪 npm run test-email .......... Basic test
  🧪 npm run test-email:interactive .. Interactive test
  🧪 npm run dev ................ Start servers
```

---

## 💡 Quick Wins

### Make Email Template Custom
Edit: `nano /Users/indu/Documents/gymapp-folder/server/emailService.js`

Find line 33, edit between ` html: \` ` backticks:
```javascript
html: `
  <h2>Welcome, ${clientName}! 🎉</h2>
  <p>YOUR CUSTOM MESSAGE HERE</p>
  <!-- Add custom content -->
`
```

Save and restart server.

### Change Email Sender Name
Edit `.env`:
```
OWNER_NAME=Your Custom Gym Name
```

### Test Different Recipients
```bash
npm run test-email:interactive
# Type: test@example.com (any email)
# All emails come from: EMAIL_USER
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|------|-----|
| ❌ "Cannot find module" | `npm install` in correct folder |
| ❌ "Failed to authenticate" | Check Gmail app password (16 chars) |
| ❌ Email in spam | Check from address, add to contacts |
| ❌ "Port 3000 in use" | `lsof -i :3000` then `kill -9 <PID>` |
| ❌ SMS not received | Phone verified in Twilio? |
| ❌ .env not loading | Restart server after editing |
| ❌ Twilio not found | `npm install twilio` |

---

## 📞 Need More Help?

Read full guides:
```bash
# Complete Email/SMS Guide
cat /Users/indu/Documents/gymapp-folder/EMAIL_SMS_GUIDE.md

# Step-by-step checklist
cat /Users/indu/Documents/gymapp-folder/SETUP_CHECKLIST.md

# Troubleshooting
cat /Users/indu/Documents/gymapp-folder/TROUBLESHOOTING.md
```

---

## 🎬 TL;DR (Copy-Paste Steps)

```bash
# 1. Get Gmail app password from:
# https://myaccount.google.com/apppasswords
# (Keep it open, you'll need the 16-character password)

# 2. Edit .env
nano /Users/indu/Documents/gymapp-folder/server/.env

# 3. Add/update these 4 lines:
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your_16_char_password
# OWNER_NAME=Your Gym
# OWNER_EMAIL=your-email@example.com

# 4. Save: Ctrl+X, Y, Enter

# 5. Test
cd /Users/indu/Documents/gymapp-folder/server
npm run test-email:interactive

# 6. Open browser and test via app
# http://localhost:5173
```

---

**Save this file! Print it! Read it! 📌**

Good luck with email setup! 🚀

