import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get all notifications
router.get('/', (req, res) => {
  db.all(
    `SELECT n.*, c.name, c.email FROM notifications n
     JOIN clients c ON n.client_id = c.id
     WHERE n.user_id = ?
     ORDER BY n.sent_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Manual check for expiring subscriptions
router.post('/check', (req, res) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  db.all(
    `SELECT COUNT(*) as count FROM clients WHERE user_id = ? AND subscription_end = ? AND notification_sent = 0`,
    [req.user.id, tomorrowDate],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        message: 'Notification check completed',
        expiringCount: rows[0].count
      });
    }
  );
});

// Resend email notifications for a client. Body: { client_id, type: 'welcome'|'update'|'both' }
router.post('/resend', async (req, res) => {
  const { client_id, type = 'both' } = req.body || {};
  if (!client_id) return res.status(400).json({ error: 'client_id is required' });

  db.get('SELECT * FROM clients WHERE id = ? AND user_id = ?', [client_id, req.user.id], async (err, client) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    try {
      const { sendWelcomeEmail } = await import('../emailService.js');
      const ownerName = process.env.OWNER_NAME || 'Gym Owner';

      const results = [];

      if (type === 'welcome' || type === 'both' || type === 'update') {
        const emailSent = await sendWelcomeEmail(client.email, client.name, client.subscription_type, ownerName);
        db.run(
          `INSERT INTO notifications (user_id, client_id, notification_type, message, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [req.user.id, client.id, type === 'update' ? 'update_email' : 'welcome_email', emailSent ? `Email resent to ${client.email}` : `Email resend failed for ${client.email}`],
          (e) => { if (e) console.error('Notification log error (resend email):', e); }
        );
        results.push({ channel: 'email', success: !!emailSent });
      }

      res.json({ message: 'Email resend attempted', results });
    } catch (err) {
      console.error('Error in resend:', err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });
});

export default router;


