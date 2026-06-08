import cron from 'node-cron';
import db from './database.js';
import { sendExpirationEmail } from './emailService.js';
import dotenv from 'dotenv';

dotenv.config();

// Run daily at 9 AM
export function startNotificationScheduler() {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily notification check...');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    db.all(
      `SELECT * FROM clients WHERE subscription_end = ? AND notification_sent = 0`,
      [tomorrowDate],
      async (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return;
        }

        for (const client of rows) {
          const daysLeft = calculateDaysLeft(client.subscription_end);

          const emailSent = await sendExpirationEmail(
            client.email,
            client.name,
            daysLeft,
            process.env.OWNER_EMAIL,
            process.env.OWNER_NAME,
            client.subscription_start,
            client.subscription_end
          );

           if (emailSent) {
             db.run(
               `UPDATE clients SET notification_sent = 1 WHERE id = ?`,
               [client.id],
               (err) => {
                 if (err) console.error('Update error:', err);
                 else console.log(`Notification marked as sent for client ${client.id}`);
               }
             );

             // Log notification in database
             db.run(
               `INSERT INTO notifications (user_id, client_id, notification_type, message, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
               [client.user_id, client.id, 'expiration', `Subscription expiration reminder sent to ${client.email} and owner`],
               (err) => {
                 if (err) console.error('Notification log error:', err);
               }
             );
           }
        }
      }
    );
  });

  console.log('Notification scheduler started - runs daily at 9 AM');
}

function calculateDaysLeft(endDate) {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Manual check function
export function checkExpiringSubscriptions(io) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  db.all(
    `SELECT * FROM clients WHERE subscription_end = ? AND notification_sent = 0`,
    [tomorrowDate],
    async (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return;
      }

      if (rows.length === 0) {
        console.log('No expiring subscriptions found.');
        return;
      }

      console.log(`Found ${rows.length} expiring subscription(s)`);

       for (const client of rows) {
         const daysLeft = calculateDaysLeft(client.subscription_end);

         const emailSent = await sendExpirationEmail(
           client.email,
           client.name,
           daysLeft,
           process.env.OWNER_EMAIL,
           process.env.OWNER_NAME,
           client.subscription_start,
           client.subscription_end
         );

         if (emailSent) {
           db.run(
             `UPDATE clients SET notification_sent = 1 WHERE id = ?`,
             [client.id],
             (err) => {
               if (err) console.error('Update error:', err);
               else {
                 console.log(`Notification marked as sent for client ${client.id}`);
                 io.emit('notification:sent', { clientId: client.id });
               }
             }
           );

           db.run(
             `INSERT INTO notifications (user_id, client_id, notification_type, message, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
             [client.user_id, client.id, 'expiration', `Manual check: Subscription expiration reminder sent`],
             (err) => {
               if (err) console.error('Notification log error:', err);
             }
           );
         }
      }
    }
  );
}

