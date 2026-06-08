import { useState, useEffect } from 'react';
import styles from './Notifications.module.css';
import { ToastContainer } from '../components/Toast';
import { notificationsAPI } from '../api/api';
import { useToast } from '../hooks/useToast';

function ResendButton({ clientId, onResend }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      className={styles.resendBtn}
      disabled={loading}
      onClick={() => onResend(clientId, 'both', setLoading)}
    >
      {loading ? 'Resending...' : '↻ Resend'}
    </button>
  );
}

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    try {
      const response = await notificationsAPI.check();
      fetchNotifications();
      showToast(`Check complete - ${response.data.expiringCount} expiring found`, 'success');
    } catch (error) {
      showToast('Failed to check notifications', 'error');
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async (clientId, type = 'both', setLoadingFn) => {
    if (setLoadingFn) setLoadingFn(true);
    try {
      const resp = await notificationsAPI.resend(clientId, type);
      const results = resp.data.results || [];
      const ok = results.every(r => r.success);
      showToast(ok ? 'Notifications resent' : 'Resend attempted (see logs)', ok ? 'success' : 'warning');
      fetchNotifications();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to resend notifications', 'error');
    } finally {
      if (setLoadingFn) setLoadingFn(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Notifications</h1>
            <p>View all subscription expiration notifications</p>
          </div>
          <button
            className={styles.checkBtn}
            onClick={handleCheckNow}
            disabled={checking}
          >
            {checking ? 'Checking...' : '🔄 Run Check Now'}
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className={styles.empty}>
            <p>No notifications yet</p>
            <p className={styles.emptySubtext}>Notifications will appear here when subscription reminders are sent</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map(notification => (
                  <tr key={notification.id}>
                    <td className={styles.memberCell}>{notification.name}</td>
                    <td>{notification.email}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[notification.notification_type]}`}>
                        {notification.notification_type}
                      </span>
                    </td>
                    <td className={styles.message}>{notification.message}</td>
                    <td className={styles.date}>{formatDate(notification.sent_at)}</td>
                    <td className={styles.actionsCell}>
                      <ResendButton clientId={notification.client_id} onResend={handleResend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

