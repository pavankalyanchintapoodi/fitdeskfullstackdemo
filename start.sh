#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏋️  Gym Subscription Tracker - Quick Start${NC}\n"

# Check if in correct directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: Run this script from the root directory (gymapp-folder)${NC}"
  exit 1
fi

echo -e "${YELLOW}Step 1: Checking dependencies...${NC}"
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm run install-all
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Dependencies installed${NC}\n"
else
  echo -e "${GREEN}✅ Dependencies already installed${NC}\n"
fi

echo -e "${YELLOW}Step 2: Checking database...${NC}"
if [ ! -f "server/gym_tracker.db" ]; then
  echo -e "${YELLOW}Seeding database...${NC}"
  npm run seed
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to seed database${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Database seeded${NC}\n"
else
  echo -e "${GREEN}✅ Database already exists${NC}\n"
fi

echo -e "${GREEN}✅ All systems ready!${NC}\n"
echo -e "${BLUE}Step 3: Starting servers...${NC}"
echo -e "${YELLOW}Backend: http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}Login with: owner@gym.com / password123${NC}\n"

npm run dev

