import express from 'express';
import db from '../database.js';
import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import { authenticateToken } from '../authMiddleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const exportsDir = join(__dirname, '../exports');
const router = express.Router();

// Ensure exports directory exists
try {
  mkdirSync(exportsDir, { recursive: true });
} catch (err) {
  console.error('Failed to create exports directory:', err);
}

router.use(authenticateToken);

// Export clients as CSV
router.get('/', (req, res) => {
  db.all('SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], async (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    try {
       const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
       const filePath = join(exportsDir, `fitdesk_members_${timestamp}.csv`);

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'name', title: 'Name' },
          { id: 'email', title: 'Email' },
          { id: 'phone', title: 'Phone' },
          { id: 'subscription_start', title: 'Start Date' },
          { id: 'subscription_end', title: 'End Date' },
          { id: 'subscription_type', title: 'Plan' },
          { id: 'status', title: 'Status' },
          { id: 'amount_paid', title: 'Amount Paid' },
          { id: 'amount_due', title: 'Amount Due' },
          { id: 'payment_mode', title: 'Payment Mode' },
          { id: 'payment_status', title: 'Payment Status' },
          { id: 'last_visit', title: 'Last Visit' },
          { id: 'created_at', title: 'Created At' }
        ]
      });

      await csvWriter.writeRecords(rows.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        subscription_start: client.subscription_start,
        subscription_end: client.subscription_end,
        subscription_type: client.subscription_type,
        status: calculateStatus(client.subscription_end),
        amount_paid: client.amount_paid || 0,
        amount_due: client.amount_due || 0,
        payment_mode: client.payment_mode || '',
        payment_status: client.payment_status || '',
        last_visit: client.last_visit || '',
        created_at: client.created_at
      })));

      res.download(filePath, `fitdesk_members_${timestamp}.csv`, (err) => {
        if (err) console.error('Download error:', err);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

function calculateStatus(endDate) {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 1) return 'expiring';
  return 'active';
}

export default router;
