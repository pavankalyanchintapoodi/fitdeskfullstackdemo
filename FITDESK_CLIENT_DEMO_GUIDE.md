# FitDesk Client Demo Guide

## Product Positioning

FitDesk is a member, payment, renewal, attendance, and follow-up manager for gyms and fitness businesses.

Use this one-line pitch:

> FitDesk helps gym owners manage members, collect payments, track renewals, record attendance, and follow up on WhatsApp from one simple dashboard.

## Target Customers

- Independent gym owners
- Fitness studios
- Personal training centers
- Yoga and wellness studios
- Small chain gyms

## Problems FitDesk Solves

1. Gym owners forget who needs renewal follow-up.
2. Payment dues are tracked manually in books or WhatsApp chats.
3. Member data is scattered across notebooks, Excel, and phone contacts.
4. Owners do not know who stopped coming.
5. Renewal reminders are not organized.
6. Monthly revenue and pending dues are hard to calculate.

## Demo Flow

### 1. Login

Open FitDesk and sign in as a gym owner.

Explain:

- Each owner has their own account.
- Members are private to that owner.
- The app works on laptop, tablet, and mobile.

### 2. Dashboard

Show the Dashboard first.

Explain each card:

- Total Members: all saved gym customers.
- Active: members with valid memberships.
- Expiring Soon: members expiring today or tomorrow.
- Expired: members whose membership has ended.
- Revenue Collected: total paid amount recorded.
- Amount Due: pending dues from members.
- Inactive 7+ Days: members who have not visited recently.

Demo message:

> This screen gives the gym owner the daily action list: who has to pay, who has to renew, and who has stopped visiting.

### 3. Add Member

Go to Members and click Add Member.

Fill:

- Full name
- Email
- Phone
- Plan
- Amount paid
- Amount due
- Payment mode
- Start date
- End date

Explain:

- FitDesk stores member profile and subscription details.
- Payment status is calculated from paid and due amounts.
- A welcome email can be sent automatically.
- WhatsApp opens with a ready message for manual sending.

### 4. Member Cards

Show a member card.

Explain:

- Contact details
- Plan
- Membership start/end dates
- Days remaining
- Paid amount
- Due amount
- Last visit date
- Status badge: Active, Expiring, Expired

Business value:

> The owner does not need to open Excel or a notebook. Every important customer detail is visible on one card.

### 5. WhatsApp Follow-Up

Click WhatsApp on a member card.

Explain:

- It opens WhatsApp with a prefilled message.
- The owner reviews and taps Send.
- This keeps the feature free and simple without paid SMS APIs.

Use cases:

- Welcome message
- Renewal reminder
- Payment follow-up
- Inactive member follow-up

### 6. Renew Membership

Click Renew.

Show:

- Member name
- Current plan
- Current end date
- New start date
- New end date
- Quick options: 1 Month, 3 Months, 6 Months, 1 Year
- Amount paid
- Amount due
- Payment mode

Explain:

- Renewal updates the member subscription.
- Renewal payment is recorded.
- Renewal history is saved in the backend.
- WhatsApp renewal message opens after renewal.

### 7. Check-In

Click Check In on a member card.

Explain:

- FitDesk records today's visit.
- Last visit date updates immediately.
- Inactive member count improves on the dashboard.

Business value:

> Gym owners can see who is not attending and follow up before they quit.

### 8. Mark Paid

If a member has dues, click Mark Paid.

Explain:

- The pending due is cleared.
- Paid amount increases.
- Dashboard revenue and amount due update.

Business value:

> This helps owners reduce missed collections and track money more reliably.

### 9. Search and Filters

Show search and status filters.

Explain:

- Search by name, email, or phone.
- Filter by active, expiring, or expired.
- Useful for daily follow-up.

### 10. Notifications

Open Notifications.

Explain:

- Email notification records are shown here.
- Owners can resend email notifications.
- WhatsApp remains manual and free from the member card.

### 11. Export CSV

Click Export CSV.

Explain:

- Exports member data.
- Includes subscription, payment, and attendance fields.
- Useful for backup or accountant reporting.

## Feature List

### Member Management

- Add member
- Edit member
- Delete member
- Search members
- Filter by subscription status

### Subscription Management

- Start date
- End date
- Plan type
- Active/expiring/expired status
- Renewal workflow
- Renewal history

### Payment Management

- Amount paid
- Amount due
- Payment mode
- Payment status
- Quick mark-paid action
- Revenue dashboard

### Attendance Management

- Daily check-in
- Last visit tracking
- Inactive member count

### Communication

- Email notifications
- WhatsApp prefilled messages
- Manual WhatsApp sending to avoid SMS/API costs

### Reporting

- Dashboard analytics
- Members by plan chart
- CSV export

## Live Deployment Summary

Recommended setup:

- Frontend: Vercel
- Backend: Render
- Pilot database: SQLite with persistent disk
- Public launch database: Postgres

Production environment variables are documented in `DEPLOYMENT.md`.

## Client Demo Script

Use this script when presenting:

> Most small gyms manage customers through notebooks, Excel sheets, and WhatsApp chats. The problem is that renewals, payments, and inactive members are easy to miss. FitDesk brings all of that into one simple dashboard. A gym owner can add members, track dues, renew plans, check attendance, and send WhatsApp follow-ups in seconds.

Then show:

1. Dashboard
2. Add Member
3. Renew Membership
4. Mark Paid
5. Check In
6. WhatsApp follow-up
7. Export CSV

## Market Positioning

FitDesk is best positioned as:

> Simple CRM and payment tracker for local gyms.

Avoid calling it only a tracker. The stronger product category is:

- Gym CRM
- Fitness business manager
- Member and renewal management system

## Suggested Pricing

For early market testing:

- Free trial: 7 or 14 days
- Starter: ₹499/month for one gym
- Pro: ₹999/month with advanced reports and support
- Setup service: ₹1,999 one-time onboarding for data import

## Remaining Recommendations Before Public Launch

- Move database from SQLite to Postgres.
- Add forgot password.
- Add gym profile and logo settings.
- Add payment receipt generation.
- Add member import from CSV.
- Add automated backup.
- Add landing page for marketing.
- Add terms and privacy policy.

## Demo Checklist

Before every client demo:

- Backend is running.
- Frontend is running.
- Demo owner account exists.
- At least 5 sample members exist.
- Include one active member.
- Include one expired member.
- Include one member with due amount.
- Include one member with no recent attendance.
- Test WhatsApp opens correctly.
- Test CSV export.
