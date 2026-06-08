import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all clients with status calculation
router.get('/', (req, res) => {
  db.all('SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const clientsWithStatus = rows.map(client => ({
      ...client,
      status: calculateStatus(client.subscription_end)
    }));

    res.json(clientsWithStatus);
  });
});

// Get single client
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({
      ...row,
      status: calculateStatus(row.subscription_end)
    });
  });
});

// Create new client
router.post('/', (req, res) => {
  const {
    name,
    email,
    phone,
    subscription_start,
    subscription_end,
    subscription_type,
    amount_paid = 0,
    amount_due = 0,
    payment_mode = 'Cash'
  } = req.body;

  if (!name || !email || !phone || !subscription_start || !subscription_end || !subscription_type) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const status = calculateStatus(subscription_end);
  const paymentStatus = calculatePaymentStatus(amount_paid, amount_due);

  db.run(
    `INSERT INTO clients (user_id, name, email, phone, subscription_start, subscription_end, subscription_type, status, amount_paid, amount_due, payment_mode, payment_status, notification_sent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [req.user.id, name, email, phone, subscription_start, subscription_end, subscription_type, status, amount_paid, amount_due, payment_mode, paymentStatus],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const newClient = {
        id: this.lastID,
        name,
        email,
        phone,
        subscription_start,
        subscription_end,
        subscription_type,
        status,
        amount_paid,
        amount_due,
        payment_mode,
        payment_status: paymentStatus,
        notification_sent: 0,
        created_at: new Date().toISOString()
      };

      if (Number(amount_paid) > 0) {
        db.run(
          `INSERT INTO payments (user_id, client_id, amount, payment_mode, payment_date, note)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [req.user.id, newClient.id, amount_paid, payment_mode, subscription_start, 'Initial membership payment'],
          (err) => { if (err) console.error('Payment log error:', err); }
        );
      }

      // Asynchronously send welcome email and log the result
      setImmediate(async () => {
        try {
          // Lazy import to avoid circular deps
          const { sendWelcomeEmail } = await import('../emailService.js');
          const ownerName = process.env.OWNER_NAME || 'Gym Owner';

          const emailResult = await sendWelcomeEmail(email, name, subscription_type, ownerName);
          db.run(
            `INSERT INTO notifications (user_id, client_id, notification_type, message, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [req.user.id, newClient.id, 'welcome_email', `Welcome email ${emailResult ? 'sent' : 'failed'} to ${email}`],
            (err) => { if (err) console.error('Notification log error (email):', err); }
          );
        } catch (err) {
          console.error('Error sending welcome email:', err);
        }
      });

      // Emit socket event to connected clients (via req.io injected by server)
      try { req.io && req.io.emit && req.io.emit('client:created', newClient); } catch (e) { console.warn('Socket emit error (created):', e); }
      res.status(201).json(newClient);
    }
  );
});

// Update client
router.put('/:id', (req, res) => {
  const {
    name,
    email,
    phone,
    subscription_start,
    subscription_end,
    subscription_type,
    amount_paid = 0,
    amount_due = 0,
    payment_mode = 'Cash'
  } = req.body;

  if (!name || !email || !phone || !subscription_start || !subscription_end || !subscription_type) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Fetch existing member data first for comparison (Change 1: Smart email trigger)
  db.get('SELECT * FROM clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, existingClient) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!existingClient) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Check if any field has changed
    const hasChanged =
      existingClient.name !== name ||
      existingClient.email !== email ||
      existingClient.phone !== phone ||
      existingClient.subscription_start !== subscription_start ||
      existingClient.subscription_end !== subscription_end ||
      existingClient.subscription_type !== subscription_type ||
      Number(existingClient.amount_paid || 0) !== Number(amount_paid || 0) ||
      Number(existingClient.amount_due || 0) !== Number(amount_due || 0) ||
      existingClient.payment_mode !== payment_mode;

    const status = calculateStatus(subscription_end);
    const paymentStatus = calculatePaymentStatus(amount_paid, amount_due);

    db.run(
      `UPDATE clients SET name = ?, email = ?, phone = ?, subscription_start = ?, subscription_end = ?, subscription_type = ?, status = ?, amount_paid = ?, amount_due = ?, payment_mode = ?, payment_status = ?, notification_sent = 0 WHERE id = ? AND user_id = ?`,
      [name, email, phone, subscription_start, subscription_end, subscription_type, status, amount_paid, amount_due, payment_mode, paymentStatus, req.params.id, req.user.id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const updatedClient = {
          id: parseInt(req.params.id),
          name,
          email,
          phone,
          subscription_start,
          subscription_end,
          subscription_type,
          status,
          amount_paid,
          amount_due,
          payment_mode,
          payment_status: paymentStatus,
          last_visit: existingClient.last_visit,
          notification_sent: 0
        };

        // Only send email if data actually changed (Change 1)
        if (hasChanged) {
          setImmediate(async () => {
            try {
              const { sendUpdateEmail } = await import('../emailService.js');
              const ownerEmail = process.env.OWNER_EMAIL || '';
              const ownerName = process.env.OWNER_NAME || 'Gym Owner';

              // Send update email (Change 2)
              const emailResult = await sendUpdateEmail(updatedClient, ownerEmail, ownerName);
              db.run(
                `INSERT INTO notifications (user_id, client_id, notification_type, message, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                [req.user.id, parseInt(req.params.id), 'update_email', `Update email ${emailResult ? 'sent' : 'failed'} to ${email}`],
                (err) => { if (err) console.error('Notification log error (update email):', err); }
              );
            } catch (err) {
              console.error('Error sending update email:', err);
            }
          });
        }

        try { req.io && req.io.emit && req.io.emit('client:updated', updatedClient); } catch (e) { console.warn('Socket emit error (updated):', e); }
        res.json(updatedClient);
      }
    );
  });
});

// Delete client
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    try { req.io && req.io.emit && req.io.emit('client:deleted', { id: parseInt(req.params.id) }); } catch (e) { console.warn('Socket emit error (deleted):', e); }
    res.json({ message: 'Client deleted successfully', id: parseInt(req.params.id) });
  });
});

// Renew client subscription (Change 5)
router.post('/:id/renew', (req, res) => {
  const {
    new_end_date,
    amount_paid = 0,
    amount_due = 0,
    payment_mode = 'Cash'
  } = req.body;

  if (!new_end_date) {
    res.status(400).json({ error: 'Missing new_end_date' });
    return;
  }

  // Get today's date as subscription_start
  const today = new Date();
  const subscription_start = today.toISOString().split('T')[0];

  // Fetch existing client first
  db.get('SELECT * FROM clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, client) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const status = calculateStatus(new_end_date);
    const paymentStatus = calculatePaymentStatus(amount_paid, amount_due);

    db.run(
      `UPDATE clients SET subscription_start = ?, subscription_end = ?, status = ?, amount_paid = ?, amount_due = ?, payment_mode = ?, payment_status = ?, notification_sent = 0 WHERE id = ? AND user_id = ?`,
      [subscription_start, new_end_date, status, amount_paid, amount_due, payment_mode, paymentStatus, req.params.id, req.user.id],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const renewedClient = {
          ...client,
          subscription_start,
          subscription_end: new_end_date,
          status,
          amount_paid,
          amount_due,
          payment_mode,
          payment_status: paymentStatus,
          notification_sent: 0
        };

        db.run(
          `INSERT INTO renewal_history (user_id, client_id, previous_start, previous_end, new_start, new_end, amount_paid, amount_due, payment_mode)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [req.user.id, req.params.id, client.subscription_start, client.subscription_end, subscription_start, new_end_date, amount_paid, amount_due, payment_mode],
          (err) => { if (err) console.error('Renewal history log error:', err); }
        );

        if (Number(amount_paid) > 0) {
          db.run(
            `INSERT INTO payments (user_id, client_id, amount, payment_mode, payment_date, note)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, req.params.id, amount_paid, payment_mode, subscription_start, 'Renewal payment'],
            (err) => { if (err) console.error('Payment log error:', err); }
          );
        }

        // Send renewal email
        setImmediate(async () => {
          try {
            const { sendRenewalEmail } = await import('../emailService.js');
            const ownerEmail = process.env.OWNER_EMAIL || '';
            const ownerName = process.env.OWNER_NAME || 'Gym Owner';

            const emailResult = await sendRenewalEmail(renewedClient, new_end_date, ownerEmail, ownerName);
            db.run(
              `INSERT INTO notifications (user_id, client_id, notification_type, message, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [req.user.id, parseInt(req.params.id), 'renewal_email', `Renewal email ${emailResult ? 'sent' : 'failed'} to ${renewedClient.email}`],
              (err) => { if (err) console.error('Notification log error (renewal):', err); }
            );
          } catch (err) {
            console.error('Error sending renewal email:', err);
          }
        });

        try { req.io && req.io.emit && req.io.emit('client:updated', renewedClient); } catch (e) { console.warn('Socket emit error (renewal updated):', e); }
        res.json(renewedClient);
      }
    );
  });
});

router.post('/:id/payment', (req, res) => {
  const { amount, payment_mode = 'Cash', payment_date = new Date().toISOString().split('T')[0], note = 'Payment received' } = req.body;

  if (!amount || Number(amount) <= 0) {
    res.status(400).json({ error: 'A positive amount is required' });
    return;
  }

  db.get('SELECT * FROM clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, client) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const amountPaid = Number(client.amount_paid || 0) + Number(amount);
    const amountDue = Math.max(0, Number(client.amount_due || 0) - Number(amount));
    const paymentStatus = calculatePaymentStatus(amountPaid, amountDue);

    db.run(
      `UPDATE clients SET amount_paid = ?, amount_due = ?, payment_mode = ?, payment_status = ? WHERE id = ? AND user_id = ?`,
      [amountPaid, amountDue, payment_mode, paymentStatus, req.params.id, req.user.id],
      function(updateErr) {
        if (updateErr) {
          res.status(500).json({ error: updateErr.message });
          return;
        }

        db.run(
          `INSERT INTO payments (user_id, client_id, amount, payment_mode, payment_date, note)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [req.user.id, req.params.id, amount, payment_mode, payment_date, note],
          (paymentErr) => {
            if (paymentErr) console.error('Payment log error:', paymentErr);
          }
        );

        const updatedClient = {
          ...client,
          amount_paid: amountPaid,
          amount_due: amountDue,
          payment_mode,
          payment_status: paymentStatus
        };

        try { req.io && req.io.emit && req.io.emit('client:updated', updatedClient); } catch (e) { console.warn('Socket emit error (payment updated):', e); }
        res.json(updatedClient);
      }
    );
  });
});

router.post('/:id/check-in', (req, res) => {
  const visitDate = req.body.visit_date || new Date().toISOString().split('T')[0];

  db.get('SELECT * FROM clients WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, client) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    db.run(
      `INSERT OR IGNORE INTO attendance (user_id, client_id, visit_date) VALUES (?, ?, ?)`,
      [req.user.id, req.params.id, visitDate],
      (attendanceErr) => {
        if (attendanceErr) {
          res.status(500).json({ error: attendanceErr.message });
          return;
        }

        db.run(
          `UPDATE clients SET last_visit = ? WHERE id = ? AND user_id = ?`,
          [visitDate, req.params.id, req.user.id],
          (updateErr) => {
            if (updateErr) {
              res.status(500).json({ error: updateErr.message });
              return;
            }

            const updatedClient = { ...client, last_visit: visitDate };
            try { req.io && req.io.emit && req.io.emit('client:updated', updatedClient); } catch (e) { console.warn('Socket emit error (check-in updated):', e); }
            res.json(updatedClient);
          }
        );
      }
    );
  });
});

router.get('/:id/history', (req, res) => {
  const response = {};

  db.all('SELECT * FROM payments WHERE client_id = ? AND user_id = ? ORDER BY payment_date DESC, id DESC', [req.params.id, req.user.id], (paymentErr, payments) => {
    if (paymentErr) {
      res.status(500).json({ error: paymentErr.message });
      return;
    }

    response.payments = payments;

    db.all('SELECT * FROM attendance WHERE client_id = ? AND user_id = ? ORDER BY visit_date DESC', [req.params.id, req.user.id], (attendanceErr, attendance) => {
      if (attendanceErr) {
        res.status(500).json({ error: attendanceErr.message });
        return;
      }

      response.attendance = attendance;

      db.all('SELECT * FROM renewal_history WHERE client_id = ? AND user_id = ? ORDER BY renewed_at DESC', [req.params.id, req.user.id], (renewalErr, renewals) => {
        if (renewalErr) {
          res.status(500).json({ error: renewalErr.message });
          return;
        }

        response.renewals = renewals;
        res.json(response);
      });
    });
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

function calculatePaymentStatus(amountPaid, amountDue) {
  const paid = Number(amountPaid || 0);
  const due = Number(amountDue || 0);

  if (due <= 0 && paid > 0) return 'paid';
  if (paid > 0 && due > 0) return 'partial';
  return 'unpaid';
}

export default router;
