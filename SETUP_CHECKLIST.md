# ⚡ Email/SMS Setup Checklist

## 🎯 Quick Setup (15 minutes)

### Phase 1: Email Configuration ✅

- [ ] Open Gmail account (or create one)
- [ ] Enable 2-Step Verification at https://myaccount.google.com/security
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
  - Select **Mail** and **macOS**
  - Copy 16-character password
- [ ] Edit `.env` file:
  ```bash
  nano /Users/indu/Documents/gymapp-folder/server/.env
  ```
- [ ] Add these lines:
  ```
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASS=your_16_char_app_password
  OWNER_NAME=Your Gym
  OWNER_EMAIL=your-email@gmail.com
  ```
- [ ] Save file (Ctrl+X → Y → Enter)
- [ ] Verify with:
  ```bash
  cat /Users/indu/Documents/gymapp-folder/server/.env | grep EMAIL
  ```

---

### Phase 2: Test Email Setup ✅

- [ ] Start server:
  ```bash
  cd /Users/indu/Documents/gymapp-folder
  npm run dev
  ```

- [ ] Wait for: `✅ Server running on http://localhost:3000`

- [ ] Test email script:
  ```bash
  # In NEW terminal tab/window:
  cd /Users/indu/Documents/gymapp-folder/server
  npm run test-email
  ```

- [ ] You should see:
  ```
  ✅ EMAIL TEST PASSED!
  Email should arrive in your inbox within 1-2 minutes.
  ```

- [ ] **Check your email** - spam folder too!
  - From: `your-gmail@gmail.com`
  - Subject: `🎉 Welcome to the Gym!`
  - To: `pavankalyan.chintapoodi@gmail.com` (default test recipient)

- [ ] If failed, check:
  - [ ] Is `.env` file updated?
  - [ ] Is Gmail app password correct (16 chars)?
  - [ ] Is 2-Step Verification enabled?
  - [ ] Check server console for error message

---

### Phase 3: Test in App ✅

- [ ] Open http://localhost:5173 in browser
- [ ] Login: `owner@gym.com` / `password123`
- [ ] Go to **Members** tab
- [ ] Click **+ Add Member**
- [ ] Fill in:
  ```
  Name: Test User
  Email: YOUR_REAL_EMAIL@gmail.com (use YOUR email!)
  Phone: 555-1234
  Start: Today
  End: Tomorrow
  Plan: Basic
  ```
- [ ] Click **Submit**
- [ ] Wait 2 minutes and **check YOUR email**
- [ ] You should receive welcome email
- [ ] Check server console:
  ```
  ✅ Welcome email sent to: YOUR_REAL_EMAIL@gmail.com
  ```

---

### Phase 4: SMS Setup (Optional) 📱

Skip this if you don't want SMS. Otherwise:

- [ ] Sign up for Twilio: https://www.twilio.com/
- [ ] Get:
  - [ ] Account SID
  - [ ] Auth Token
  - [ ] Phone Number
- [ ] Install Twilio package:
  ```bash
  cd /Users/indu/Documents/gymapp-folder/server
  npm install twilio
  ```
- [ ] Add to `.env`:
  ```
  TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
  TWILIO_AUTH_TOKEN=your_auth_token
  TWILIO_PHONE_NUMBER=+1234567890
  ```
- [ ] Verify your phone in Twilio Dashboard
- [ ] Test SMS with test-email script (already installed):
  ```bash
  npm run test-email
  ```

---

### Phase 5: Test Expiration Notifications ✅

After email is working:

- [ ] Add member with end date = **Tomorrow**
- [ ] Go to **Notifications** tab
- [ ] Click **🔄 Run Check Now**
- [ ] See notification in table:
  - Member name
  - Email address
  - Message: "Expiring tomorrow"
  - Timestamp
- [ ] Check member's email (spam folder too)
  - Subject: "⏰ Your Gym Membership Expires Tomorrow!"
- [ ] Check your owner email
  - Subject: "📢 Member Alert: [Member Name]'s Membership Expires Tomorrow"

---

## 🆘 Troubleshooting

### Email Test Fails
```bash
# Check .env is correct
cat /Users/indu/Documents/gymapp-folder/server/.env | grep EMAIL

# Check Gmail password (should be 16 chars, not your regular password)
# Check if 2-Step Verification is enabled

# Try sending again
npm run test-email
```

### Email Test Passes but App Doesn't Send
```bash
# Restart server (sometimes .env doesn't reload)
# Kill: Ctrl+C in terminal
# Start: npm run dev
```

### Email in Spam
- Gmail marked it as spam? Mark as "Not Spam"
- Check email address in config
- Try sending different content

### SMS Not Working
- Phone number needs verification in Twilio
- Check free trial hasn't expired
- Verify phone format: `+15551234567`

---

## ✅ Success Indicators

After setup:

✅ **Email sending:**
- Test email arrives
- App email arrives (2 min max)
- Shows in server logs: `✅ Welcome email sent to:`

✅ **SMS sending** (if configured):
- Test SMS arrives
- App SMS arrives (10-20 sec)
- Shows in server logs: `✅ Welcome SMS sent to:`

✅ **Expiration notifications:**
- Manual check works
- Daily check at 9 AM works
- Member receives expiration email

---

## 📚 Reference

- **Full Guide:** `/Users/indu/Documents/gymapp-folder/EMAIL_SMS_GUIDE.md`
- **Email Service:** `/Users/indu/Documents/gymapp-folder/server/emailService.js`
- **Test Script:** `npm run test-email`
- **Startup Command:** `npm run dev`

---

## 🎬 Next Steps After Email/SMS Works

1. **Customize email template** - Edit HTML in `emailService.js`
2. **Add more members** - Test with different scenarios
3. **Deploy to production** - Use production Gmail account
4. **Set up monitoring** - Track email delivery
5. **Add more features** - Renewal reminders, late payments, etc.

---

**Good luck! 🚀**

