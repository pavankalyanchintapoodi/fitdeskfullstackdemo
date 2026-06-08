import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get statistics
router.get('/', (req, res) => {
  db.all('SELECT * FROM clients WHERE user_id = ?', [req.user.id], (err, clients) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = clients.length;
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let expiringToday = 0;
    let expiringTomorrow = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let inactive7Days = 0;

    const planTypes = {
      'Basic': 0,
      'Premium': 0,
      'VIP': 0,
      'Personal Training': 0
    };

    clients.forEach(client => {
      const endDate = new Date(client.subscription_end);
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        expired++;
      } else if (diffDays <= 1) {
        expiring++;
        if (diffDays === 0) expiringToday++;
        else if (diffDays === 1) expiringTomorrow++;
      } else {
        active++;
      }

      planTypes[client.subscription_type] = (planTypes[client.subscription_type] || 0) + 1;
      totalPaid += Number(client.amount_paid || 0);
      totalDue += Number(client.amount_due || 0);

      if (!client.last_visit) {
        inactive7Days++;
      } else {
        const lastVisit = new Date(client.last_visit);
        lastVisit.setHours(0, 0, 0, 0);
        const inactiveDays = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
        if (inactiveDays >= 7) inactive7Days++;
      }
    });

    res.json({
      total,
      active,
      expiring,
      expired,
      expiringToday,
      expiringTomorrow,
      totalPaid,
      totalDue,
      inactive7Days,
      planTypes: Object.entries(planTypes).map(([name, count]) => ({ name, count }))
    });
  });
});

export default router;
