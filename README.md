# FitDesk

FitDesk is a member, payment, renewal, and WhatsApp follow-up manager for gyms and fitness studios.

## What FitDesk Does

- Owner login and registration
- Member profile management
- Subscription start/end tracking
- Active, expiring, and expired status
- Renewal workflow with quick durations
- Paid amount, due amount, and payment mode tracking
- Quick mark-paid action
- WhatsApp prefilled follow-up messages
- Email notifications
- Revenue and dues dashboard
- CSV export
- Responsive UI for desktop, tablet, and mobile
- Public landing page
- Privacy Policy and Terms pages

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Axios
- Socket.IO Client
- Recharts

Backend:

- Node.js
- Express
- SQLite
- Socket.IO
- JWT auth
- Nodemailer
- node-cron

## Local Setup

Install dependencies:

```bash
npm run install-all
```

Create server env:

```bash
cp server/.env.example server/.env
```

Create client env:

```bash
cp client/.env.example client/.env
```

Run locally:

```bash
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Important Environment Variables

Backend:

```env
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
DB_PATH=./gym_tracker.db
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
OWNER_EMAIL=owner@example.com
OWNER_NAME=FitDesk Owner
DEFAULT_COUNTRY_CODE=+91
```

Frontend:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## Deployment

Recommended:

- Frontend: Vercel
- Backend: Render
- Pilot database: SQLite with Render persistent disk
- Public launch database: Postgres

Deployment files included:

- `render.yaml`
- `client/vercel.json`
- `DEPLOYMENT.md`
- `client/.env.example`
- `server/.env.example`

## Production Checklist

Before sharing with real gym owners:

- Set a strong production `JWT_SECRET`.
- Set backend `CLIENT_URL` to the deployed frontend URL.
- Set frontend `VITE_API_URL` and `VITE_SOCKET_URL` to the deployed backend URL.
- Use a persistent disk for SQLite or migrate to Postgres.
- Rotate development email credentials.
- Test register, login, add member, edit, renew, mark paid, WhatsApp, email, and CSV export.
- Add a custom domain.
- Review Privacy Policy and Terms with a legal professional before public launch.

## Demo And Sales Guide

Use `FITDESK_CLIENT_DEMO_GUIDE.md` to explain and demo FitDesk to gym owners.
