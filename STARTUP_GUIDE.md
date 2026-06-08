# 🏋️ Gym Subscription Tracker - Startup Guide

## ✅ Complete Application Built

Your full-stack gym subscription tracker is **fully functional and ready to run**!

### What's Included:
- ✅ Multi-user authentication (gym owners can register/login)
- ✅ Member management (CRUD operations)
- ✅ Real-time updates with Socket.IO
- ✅ Email notifications 1 day before expiry
- ✅ CSV export functionality
- ✅ Dark theme UI with responsive design
- ✅ Statistics dashboard with charts

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies (One-time only)
```bash
cd /Users/indu/Documents/gymapp-folder
npm run install-all
```
This installs dependencies for root, server, and client. **Wait for it to complete** (may take 1-2 minutes).

### Step 2: Seed Demo Data (One-time only)
```bash
npm run seed
```
This creates:
- Test gym owner account: `owner@gym.com` / `password123`
- 8 demo members with various subscription statuses

### Step 3: Start the App
```bash
npm run dev
```
This starts both the backend and frontend servers simultaneously.

---

## 📋 What to Expect

When you run `npm run dev`, you should see:

### Terminal Output:
```
> concurrently "npm run server" "npm run client"

[0] 🏋️ Gym Subscription Tracker Server running on http://localhost:3000
[1] VITE v5.x.x ready in xxx ms

[1]  ➜  Local:   http://localhost:5173/
```

### Browser:
- Navigate to: **http://localhost:5173**
- You'll see the login page
- Login with: 
  - Email: `owner@gym.com`
  - Password: `password123`

---

## 🔧 Troubleshooting

### Issue: "localhost refused to connect" (ERR_CONNECTION_REFUSED)

**Solution 1: Verify dependencies are installed**
```bash
# Check if node_modules exist
ls -la /Users/indu/Documents/gymapp-folder/server/node_modules
ls -la /Users/indu/Documents/gymapp-folder/client/node_modules

# If missing, reinstall:
npm run install-all
```

**Solution 2: Port already in use**
```bash
# Check if ports 3000 and 5173 are in use
lsof -i :3000
lsof -i :5173

# Kill the process using port 3000 (if needed):
kill -9 <PID>
```

**Solution 3: Start servers separately**
```bash
# Terminal 1 - Start backend:
cd /Users/indu/Documents/gymapp-folder/server
npm run dev
# You should see: "🏋️ Gym Subscription Tracker Server running on http://localhost:3000"

# Terminal 2 - Start frontend:
cd /Users/indu/Documents/gymapp-folder/client
npm run dev
# You should see: "VITE v5.x.x ready in xxx ms"
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clean install
rm -rf /Users/indu/Documents/gymapp-folder/server/node_modules
rm -rf /Users/indu/Documents/gymapp-folder/client/node_modules
npm run install-all
```

### Issue: Database errors

**Solution:**
```bash
# Reseed the database
npm run seed

# If that fails, delete and recreate:
cd /Users/indu/Documents/gymapp-folder/server
rm gym_tracker.db
npm run seed
```

---

## 📱 How to Use the App

### Login
1. Go to http://localhost:5173
2. Enter: `owner@gym.com` / `password123`
3. Click "Sign In"

### Dashboard (First Page)
- See 4 stat cards: Total, Active, Expiring Soon, Expired
- View bar chart of members by plan type
- See alert if anyone expires today or tomorrow

### Members (Tab 2)
- View all members in a grid
- **Search** by name, email, or phone
- **Filter** by status: All, Active, Expiring, Expired
- **Add Member** - Click "+ Add Member" button
- **Edit Member** - Click edit button on member card
- **Delete Member** - Click delete button, confirm in modal
- **Export CSV** - Click "📥 Export CSV" button

### Notifications (Tab 3)
- View history of all sent notifications
- Click "🔄 Run Check Now" to manually check for expiring subscriptions
- Table shows: Member name, email, notification type, message, sent time

### Logout
- Click "🚪 Logout" in navigation (top right)
- Returns to login page

---

## 🛠️ Environment Setup

The `.env` file is already configured at:
```
/Users/indu/Documents/gymapp-folder/server/.env
```

**For Production Email Notifications:**
Edit the file and add:
```
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
OWNER_EMAIL=your_email@example.com
OWNER_NAME=Your Name
JWT_SECRET=your-secret-key-for-production
```

**To get Gmail app password:**
1. Enable 2FA on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Create app password for "Mail" and "macOS"
4. Copy the 16-character password into EMAIL_PASS

---

## 📊 Test the Features

### Add a Test Member:
1. Click "+ Add Member"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Phone: 555-1234
   - Start Date: (today)
   - End Date: (tomorrow)
   - Plan: Basic
3. Submit
4. You should see a success toast and member card

### Test Expiration Alert:
1. Add a member with end date = tomorrow
2. You'll see "⚠️ X member(s) expire tomorrow!" alert on Dashboard
3. Go to Notifications → "🔄 Run Check Now"
4. Should show notification was processed

### Test Real-time Updates:
1. Open 2 browser tabs to the app
2. Add a member in one tab
3. The other tab updates instantly (Socket.IO)

---

## 📁 Project Structure

```
gymapp-folder/
├── package.json               # Root npm scripts
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Dashboard, Members, Notifications
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context (global state)
│   │   ├── hooks/            # Custom hooks (useSocket, useToast)
│   │   ├── api/              # API client setup
│   │   ├── styles/           # Global CSS (dark theme)
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   └── package.json
│
└── server/                    # Node.js/Express backend
    ├── server.js             # Main server file with Socket.IO
    ├── database.js           # SQLite setup
    ├── authMiddleware.js     # JWT authentication
    ├── notificationScheduler.js # Cron job for daily checks
    ├── emailService.js       # Nodemailer setup
    ├── routes/
    │   ├── auth.js           # Register, Login, Get User
    │   ├── clients.js        # CRUD members
    │   ├── stats.js          # Dashboard statistics
    │   ├── notifications.js  # Notification history
    │   └── export.js         # CSV export
    ├── seed.js               # Demo data seeder
    ├── .env                  # Environment variables
    ├── gym_tracker.db        # SQLite database
    ├── exports/              # CSV export folder
    └── package.json
```

---

## 🔐 Security Features

✅ Passwords hashed with bcryptjs
✅ JWT tokens for auth (7-day expiration)
✅ Bearer token validation on all protected routes
✅ User data isolation (each owner only sees their members)
✅ CORS configured for localhost
✅ Input validation on all forms

---

## 🎨 Tech Stack

**Frontend:**
- React 18 with Vite
- React Router v6 for navigation
- Axios for API calls
- Socket.IO for real-time updates
- Recharts for data visualization
- Pure CSS (no UI libraries)

**Backend:**
- Node.js + Express
- SQLite3 for database
- Nodemailer for emails
- node-cron for scheduled tasks
- Socket.IO for WebSocket connections
- bcryptjs for password hashing
- JWT for authentication

---

## ❓ FAQ

**Q: Can I add multiple gym owners?**
A: Yes! Owners can register at `/register`. Each owner only sees their own members.

**Q: How do email notifications work?**
A: node-cron runs daily at 9 AM (configurable). It checks for subscriptions expiring tomorrow and sends emails to both member and owner.

**Q: Can I test notifications manually?**
A: Yes! Go to Notifications → "🔄 Run Check Now" to trigger an immediate check.

**Q: How do I reset everything?**
A: Delete `gym_tracker.db` and run `npm run seed` again.

**Q: Can I change the port?**
A: Yes! Edit `server/.env`: `PORT=3001` (and update client `src/api/api.js`)

**Q: Is the app production-ready?**
A: The core features are complete and functional. For production:
- Add rate limiting
- Add request logging
- Setup HTTPS
- Use a real database (PostgreSQL)
- Add API error tracking (Sentry)
- Setup CI/CD pipeline

---

## 💡 Next Steps

1. ✅ Start the app with `npm run dev`
2. ✅ Login with demo account
3. ✅ Add some test members
4. ✅ Try the features (search, filter, edit, delete, export)
5. ✅ Invite other gym owners to register
6. ✅ Configure email for production use

---

## 🆘 Still Having Issues?

1. Check terminal output for error messages
2. Verify ports 3000 and 5173 are not in use
3. Ensure dependencies installed: `npm run install-all`
4. Clear browser cache (Cmd+Shift+Delete)
5. Try starting servers separately in different terminals

**Still stuck?** The app is fully built and tested. Most issues are environment/setup related, not code issues.

---

## 🚀 Run This Command Now:

```bash
cd /Users/indu/Documents/gymapp-folder && npm run install-all && npm run seed && npm run dev
```

Then open: http://localhost:5173

That's it! 💪

