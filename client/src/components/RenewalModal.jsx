import { useState, useEffect } from 'react';
import styles from './RenewalModal.module.css';

export function RenewalModal({ isOpen, member, onConfirm, onCancel }) {
  const [newEndDate, setNewEndDate] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');

  const today = new Date().toISOString().split('T')[0];

  const addMonths = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen && member) {
      setNewEndDate(addMonths(1));
      setAmountPaid(member.amount_due > 0 ? member.amount_due : '');
      setAmountDue(0);
      setPaymentMode(member.payment_mode || 'Cash');
    }
  }, [isOpen, member]);

  const handleConfirm = () => {
    if (newEndDate) {
      onConfirm({
        new_end_date: newEndDate,
        amount_paid: Number(amountPaid || 0),
        amount_due: Number(amountDue || 0),
        payment_mode: paymentMode
      });
    }
  };

  if (!isOpen || !member) return null;

  const currentEndDate = new Date(member.subscription_end).toLocaleDateString();
  const selectedEndDate = newEndDate ? new Date(newEndDate).toLocaleDateString() : '';

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Renew Membership</span>
            <h2>{member.name}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onCancel} aria-label="Close">×</button>
        </div>

        <div className={styles.body}>
          <div className={styles.summary}>
            <div>
              <span className={styles.summaryLabel}>Plan</span>
              <strong>{member.subscription_type}</strong>
            </div>
            <div>
              <span className={styles.summaryLabel}>Current End</span>
              <strong>{currentEndDate}</strong>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="renewal-start">New Start Date</label>
              <input id="renewal-start" type="date" value={today} disabled />
            </div>

            <div className={styles.field}>
              <label htmlFor="renewal-end">New End Date</label>
              <input
                id="renewal-end"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={today}
              />
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="renewal-paid">Amount Paid</label>
              <input
                id="renewal-paid"
                type="number"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="renewal-due">Amount Due</label>
              <input
                id="renewal-due"
                type="number"
                min="0"
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="renewal-payment-mode">Payment Mode</label>
            <select
              id="renewal-payment-mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className={styles.quickSet}>
            {[1, 3, 6, 12].map(months => (
              <button
                key={months}
                type="button"
                className={newEndDate === addMonths(months) ? styles.quickActive : ''}
                onClick={() => setNewEndDate(addMonths(months))}
              >
                {months === 12 ? '1 Year' : `${months} Month${months > 1 ? 's' : ''}`}
              </button>
            ))}
          </div>

          <div className={styles.preview}>
            <span>New membership period</span>
            <strong>{new Date(today).toLocaleDateString()} - {selectedEndDate}</strong>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            Confirm Renewal
          </button>
        </div>
      </div>
    </div>
  );
}
