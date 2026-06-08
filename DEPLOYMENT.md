# FitDesk Deployment Checklist

## Recommended Hosting

- Frontend: Vercel
- Backend: Render
- Database for first pilot: SQLite on a persistent disk
- Database for public launch: Postgres

## Backend Environment Variables

Set these on Render:

```env
PORT=3000
CLIENT_URL=https://your-fitdesk-frontend.vercel.app
JWT_SECRET=use-a-long-random-production-secret
DB_PATH=/var/data/fitdesk.sqlite
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
OWNER_EMAIL=owner@example.com
OWNER_NAME=FitDesk Owner
DEFAULT_COUNTRY_CODE=+91
```

If you keep SQLite on Render, attach a persistent disk and set `DB_PATH` to a path on that disk. Without persistent storage, database changes can be lost when the service restarts.

## Frontend Environment Variables

Set these on Vercel:

```env
VITE_API_URL=https://your-fitdesk-backend.onrender.com
VITE_SOCKET_URL=https://your-fitdesk-backend.onrender.com
```

## Build Commands

Frontend:

```bash
cd client
npm install
npm run build
```

Backend:

```bash
cd server
npm install
npm run dev
```

For Render, use:

```bash
node server.js
```

## Production Readiness

Before sharing with real gym owners:

- Rotate any development email app passwords.
- Use a strong production `JWT_SECRET`.
- Configure the deployed frontend URL in backend `CLIENT_URL`.
- Confirm email sending from the deployed backend.
- Test login, register, add member, renew, check-in, payment, export CSV, and WhatsApp links.
- Back up the database regularly.
- Move to Postgres before a broad public launch.

## Current Product Features

- Owner login/register
- Member management
- Subscription status tracking
- Renewal workflow
- Payment paid/due tracking
- Attendance check-in and inactive member metric
- WhatsApp manual messaging
- Email notifications
- CSV export
- Responsive dashboard and member screens
