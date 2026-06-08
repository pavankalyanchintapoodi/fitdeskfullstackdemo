# 📧 Email & SMS Workflow Guide

## 🎯 Current Workflow Overview

Your app already automatically sends welcome notifications when a member is created:

```
1. Add Member (via UI)
   ↓
2. Backend receives POST /api/clients
   ↓
3. ✅ Connects to Gmail (EMAIL_USER & EMAIL_PASS)
   ↓
4. ✅ Sends HTML welcome email to member
   ↓
5. ✅ If Twilio configured, sends SMS to member
   ↓
6. ✅ Logs ✅ or ❌
   ↓
7. Member receives email (in 1-2 minutes)
   ↓
8. Member receives SMS (if Twilio configured)
```

---

## 🚀 Continue From Step: Setting Up Email & SMS

### Step 1: Configure Gmail

**Get Gmail App Password:**

1. Go to https://myaccount.google.com/apppasswords
2. If prompted, enable 2-Step Verification first
3. Select **Mail** and **macOS** (or your device)
4. Click **Generate**
5. Copy the 16-character password

**Add to `.env` file:**

```bash
# Open the .env file
nano /Users/indu/Documents/gymapp-folder/server/.env
```

Add these lines:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
OWNER_NAME=Your Gym Name
OWNER_EMAIL=your-email@example.com
```

Save (Ctrl+X, then Y, then Enter)

---

### Step 2: Test Email (Without SMS)

Start the server:
```bash
cd /Users/indu/Documents/gymapp-folder
npm run dev
```

Then:

1. Open http://localhost:5173
2. Login with `owner@gym.com` / `password123`
3. Go to **Members** tab
4. Click **+ Add Member**
5. Fill in:
   - Name: `Test User`
   - Email: `your-real-email@gmail.com` (use YOUR email to receive the test)
   - Phone: `555-1234`
   - Start: Today
   - End: Tomorrow
   - Plan: Basic
6. Click **Submit**

**Check your email** (in 2 minutes):
- Subject: `🎉 Welcome to the Gym!`
- From: `your-gmail@gmail.com`
- You should see welcome email with member name and plan info

**Check server logs:**
```
✅ Welcome email sent to: your-real-email@gmail.com
```

---

### Step 3: Configure Twilio (Optional)

If you want to send SMS messages too:

1. Go to https://www.twilio.com/
2. Sign up for free trial account
3. Get your:
   - **Account SID**
   - **Auth Token**
   - **Phone Number** (Twilio provides one)

**Add to `.env` file:**

```bash
nano /Users/indu/Documents/gymapp-folder/server/.env
```

Add:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Install Twilio package:**

```bash
cd /Users/indu/Documents/gymapp-folder/server
npm install twilio
```

---

### Step 4: Test Email + SMS

Restart server:
```bash
cd /Users/indu/Documents/gymapp-folder
npm run dev
```

Add a new member again:
- Name: `SMS Test`
- Email: `test@example.com`
- Phone: `+1555123456` (use YOUR real number with +1 prefix)
- Or: `5551234567` (app will auto-format to +15551234567)

**Check logs:**
```
✅ Welcome email sent to: test@example.com
✅ Welcome SMS sent to: +15551234567
```

**Check your phone** - You should receive the SMS in 10-20 seconds

---

## ⏰ Next Step: Expiration Notifications

After a member joins, the system automatically checks daily for expiring subscriptions at **9 AM**.

### How It Works:

1. **Daily Scheduler** (runs at 9 AM automatically)
   - Finds members expiring tomorrow
   - Sends email to member + gym owner
   - Logs notification

2. **Manual Check** (on demand)
   - Go to **Notifications** tab
   - Click **🔄 Run Check Now**
   - Triggers immediate check

3. **What members receive:**
   - Email: "Your Gym Membership Expires Tomorrow!"
   - Reminder to renew subscription

---

## 🧪 Test Expiration Notifications

### Test Method 1: Add Member Expiring Tomorrow

1. Add member with:
   - End Date: **Tomorrow** (click date, select tomorrow)
   - Other fields: normal

2. Wait for 9 AM (or...)

3. Go to **Notifications** tab
4. Click **🔄 Run Check Now**
5. See notification appear in table

---

### Test Method 2: Force Check 

```bash
curl -X POST http://localhost:3000/api/notifications/check \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

(Get your JWT token from browser localStorage after login)

---

## 📊 Workflow After Member Joins

```
Day 1: Member Joins
├─ ✅ Instant: Welcome Email
├─ ✅ Instant: Welcome SMS (if Twilio)
└─ 📱 Member receives notifications

Days 2-7: Member is Active
└─ 🟢 Status = "active"

Day 8 (Tomorrow Before End): Member Expiring Soon
├─ ⏰ 9 AM: Auto check runs
├─ 📧 Email sent to member: "Expires Tomorrow!"
├─ 📧 Email sent to owner: "Member Alert"
├─ 📱 Notification logged in history
└─ 🟡 Status = "expiring"

Day 9+: Member Expired
└─ 🔴 Status = "expired"
```

---

## 🔧 Debugging Email/SMS Issues

### Email not being received?

1. **Check .env file:**
   ```bash
   cat /Users/indu/Documents/gymapp-folder/server/.env
   ```
   - Make sure `EMAIL_USER` and `EMAIL_PASS` are set
   - Make sure it's an actual Gmail account

2. **Check server logs:**
   ```
   ❌ Welcome email error: ...
   ```
   - Copy the full error message

3. **Common issues:**
   - ❌ Wrong app password (use the 16-character one from Google, not your Gmail password)
   - ❌ Email uses old format (use `your-email@gmail.com`, not `your-email@googlemail.com`)
   - ❌ 2-Step Verification not enabled on Gmail

4. **Test Gmail directly:**
   ```bash
   cd /Users/indu/Documents/gymapp-folder/server
   npm run test-email
   ```

---

### SMS not being received?

1. **Check if Twilio is configured:**
   ```bash
   cat /Users/indu/Documents/gymapp-folder/server/.env | grep TWILIO
   ```

2. **Check server logs:**
   - If using Free Trial: SMS only works to verified numbers
   - Go to Twilio Dashboard → Phone Numbers → Verify your number

3. **Common issues:**
   - ❌ Twilio package not installed: `npm install twilio`
   - ❌ Free trial expired
   - ❌ Phone number not verified
   - ❌ Wrong phone format (use `+1` prefix)

4. **Check phone number format:**
   - ✅ Correct: `+15551234567`
   - ✅ Correct: `5551234567` (app auto-formats)
   - ❌ Wrong: `555-123-4567` (dashes not allowed)
   - ❌ Wrong: `1-555-123-4567` (hyphens not allowed)

---

## 📝 Email Template Customization

The welcome email is in `server/emailService.js` (lines 28-58).

To customize:

1. Open `server/emailService.js`
2. Find the `sendWelcomeEmail` function
3. Edit the HTML template:

```javascript
html: `
  <h2>Welcome, ${clientName}! 💪</h2>
  <p>Your custom message here...</p>
  <ul>
    <li>Custom item 1</li>
    <li>Custom item 2</li>
  </ul>
  <p>Best regards,<br/><strong>${ownerName}</strong></p>
`
```

4. Save and restart server
5. Test with new member

---

## 📋 Email/SMS Sent Successfully Checklist

After adding a member, check:

✅ **Server logs show:**
```
✅ Welcome email sent to: member@email.com
✅ Welcome SMS sent to: +15551234567
```

✅ **Member receives email in 2 minutes** with:
- Subject: "🎉 Welcome to the Gym!"
- Member name in greeting
- Plan type displayed
- Gym owner name at bottom

✅ **Member receives SMS** (if Twilio configured) with:
- Welcome message
- Plan name
- Support contact info

✅ **Notification history logged:**
- Go to **Notifications** tab
- See entry with timestamp

---

## 🚀 Next Features to Implement

After email/SMS is working:

1. **Custom SMS templates** - Different messages for different plan types
2. **Renewal reminders** - Email 2 weeks before expiry
3. **Late payment alerts** - After member expires
4. **Birthday emails** - Personalized offers
5. **Member portal** - Self-service renewal
6. **WhatsApp integration** - Use Twilio WhatsApp API
7. **Email scheduling** - Queue emails, send in batches

---

## 📚 Useful Files

- **EmailService:** `/Users/indu/Documents/gymapp-folder/server/emailService.js`
- **Server setup:** `/Users/indu/Documents/gymapp-folder/server/server.js` (lines 112-134)
- **Notification Scheduler:** `/Users/indu/Documents/gymapp-folder/server/notificationScheduler.js`
- **Environment variables:** `/Users/indu/Documents/gymapp-folder/server/.env`

---

## ✅ Your Action Items

- [ ] 1. Get Gmail app password
- [ ] 2. Add `EMAIL_USER` and `EMAIL_PASS` to `.env`
- [ ] 3. Test email by adding a member
- [ ] 4. (Optional) Set up Twilio
- [ ] 5. (Optional) Add Twilio credentials to `.env`
- [ ] 6. Test SMS if Twilio found
- [ ] 7. Add member expiring tomorrow
- [ ] 8. Test notification check
- [ ] 9. Customize email template (optional)
- [ ] 10. Deploy to production!

---

Need help? Check `/Users/indu/Documents/gymapp-folder/TROUBLESHOOTING.md`

