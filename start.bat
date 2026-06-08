@echo off
REM Colors don't work in batch, but we can use title and formatting

title Gym Subscription Tracker - Quick Start

echo.
echo ====================================
echo 🏋️  Gym Subscription Tracker
echo ====================================
echo.

REM Check if in correct directory
if not exist "package.json" (
  echo ❌ Error: Run this script from the root directory (gymapp-folder)
  pause
  exit /b 1
)

echo Step 1: Checking dependencies...
if not exist "node_modules" (
  echo Installing dependencies...
  call npm run install-all
  if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
  )
  echo ✅ Dependencies installed
  echo.
) else (
  echo ✅ Dependencies already installed
  echo.
)

echo Step 2: Checking database...
if not exist "server\gym_tracker.db" (
  echo Seeding database...
  call npm run seed
  if errorlevel 1 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
  )
  echo ✅ Database seeded
  echo.
) else (
  echo ✅ Database already exists
  echo.
)

echo ✅ All systems ready!
echo.
echo Step 3: Starting servers...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo Login with: owner@gym.com / password123
echo.

call npm run dev

pause

