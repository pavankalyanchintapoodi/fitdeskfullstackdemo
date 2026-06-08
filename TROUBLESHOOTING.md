# 🔧 Startup Troubleshooting Guide

## Issue: ERR_CONNECTION_REFUSED (localhost refused to connect)

This means the servers aren't running. Here's how to fix it:

---

## ⚡ Quick Fix (Try This First)

### macOS/Linux:
```bash
cd /Users/indu/Documents/gymapp-folder
chmod +x start.sh
./start.sh
```

### Windows:
```cmd
cd C:\Users\indu\Documents\gymapp-folder
start.bat
```

---

## 🔍 Manual Startup with Debugging

If the quick fix doesn't work, start servers separately to see specific errors:

### Terminal 1 - Start Backend:
```bash
cd /Users/indu/Documents/gymapp-folder/server
npm run dev
```

**Expected output:**
```
🚀 Starting Gym Subscription Tracker Server...
✅ Middleware configured
📦 Initializing database...
✅ Database tables initialized
🔗 Setting up routes...
✅ All routes configured
🔌 Configuring Socket.IO...
✅ Server ready to accept connections
⏰ Starting notification scheduler (runs daily at 9 AM)
✅ Server initialization complete!
🏋️ Gym Subscription Tracker Server running on http://localhost:3000
📱 Client should connect from http://localhost:5173
```

If you see errors here, **share the error message below**.

### Terminal 2 - Start Frontend:
```bash
cd /Users/indu/Documents/gymapp-folder/client
npm run dev
```

**Expected output:**
```
VITE v5.4.0  ready in 200 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 🚨 Common Errors & Solutions

### Error 1: "Port 3000 already in use" or "Port 5173 already in use"

**Cause:** Another process is using these ports

**Solution - macOS/Linux:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (replace 12345 with the PID shown)
kill -9 12345

# Or kill by name (all node processes)
killall node

# Then try again
npm run dev
```

**Solution - Windows:**
```cmd
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill it (replace 12345 with the PID shown)
taskkill /PID 12345 /F

# Or kill all node processes
taskkill /F /IM node.exe

# Then try again
npm run dev
```

---

### Error 2: "❌ Failed to initialize database"

**Cause:** Database creation failed (permissions, disk space, etc.)

**Solution:**
```bash
cd /Users/indu/Documents/gymapp-folder/server

# Delete the corrupted database
rm gym_tracker.db

# Reseed it
npm run seed

# Then start the server
npm run dev
```

---

### Error 3: "Cannot find module" or "Module not found"

**Cause:** Dependencies not installed properly

**Solution:**
```bash
cd /Users/indu/Documents/gymapp-folder

# Full clean install
rm -rf node_modules server/node_modules client/node_modules
rm package-lock.json server/package-lock.json client/package-lock.json

# Reinstall everything
npm run install-all

# Seed database
npm run seed

# Start
npm run dev
```

---

### Error 4: "EACCES: permission denied" (macOS/Linux only)

**Cause:** Don't have write permission to the directory

**Solution:**
```bash
# Fix permissions
sudo chown -R $USER:$USER /Users/indu/Documents/gymapp-folder

# Then try again
npm run dev
```

---

### Error 5: "Default engine is not set" or "no suitable file" (npm error)

**Cause:** Node version issue or npm cache corrupted

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Check Node version (should be 16+)
node --version

# If old, update Node from https://nodejs.org/

# Then retry
npm run install-all
npm run dev
```

---

## 🔐 Authentication Test

Once servers are running:

1. Open http://localhost:5173 in browser
2. You should see **Login page**
3. Login with:
   - Email: `owner@gym.com`
   - Password: `password123`
4. You should see **Dashboard** with member statistics

If you see a blank page or stuck on login, check browser console:
- Open browser DevTools (F12 or Cmd+Option+I)
- Click **Console** tab
- Look for red errors
- Share those errors below

---

## 📋 Server Startup Checklist

✅ Node.js installed (v16+)
```bash
node --version  # Should show v16.0.0 or higher
```

✅ Dependencies installed
```bash
ls /Users/indu/Documents/gymapp-folder/server/node_modules | head
ls /Users/indu/Documents/gymapp-folder/client/node_modules | head
```

✅ `.env` file exists
```bash
cat /Users/indu/Documents/gymapp-folder/server/.env
```

✅ Database exists or can be created
```bash
# Should have write permissions to server/ directory
ls -la /Users/indu/Documents/gymapp-folder/server/
```

✅ Ports 3000 and 5173 are free
```bash
lsof -i :3000      # Should return nothing
lsof -i :5173      # Should return nothing
```

---

## 🆘 If You're Still Stuck

**Run these commands and share the complete output:**

```bash
cd /Users/indu/Documents/gymapp-folder

# Check Node version
echo "Node version:" && node --version

# Check npm version
echo "npm version:" && npm --version

# Try to start backend and capture output
echo "Starting backend..." && cd server && npm run dev 2>&1 | head -50
```

---

## 💡 Quick Resets

**Hard reset everything:**
```bash
cd /Users/indu/Documents/gymapp-folder

# Remove all generated files
rm -rf node_modules server/node_modules client/node_modules
rm package-lock.json server/package-lock.json client/package-lock.json
rm server/gym_tracker.db

# Reinstall and seed
npm run install-all
npm run seed

# Start
npm run dev
```

**Just reset the database:**
```bash
cd /Users/indu/Documents/gymapp-folder/server
rm gym_tracker.db
npm run seed
```

---

## ✅ Success!

When everything works, you should see:
- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5173
- ✅ Login page loads when you visit http://localhost:5173
- ✅ Can login with owner@gym.com / password123
- ✅ Dashboard shows 8 demo members

---

**Need more help? Share:**
1. What command you ran
2. The exact error message(s)
3. Output of `node --version`
4. Output of `npm --version`

