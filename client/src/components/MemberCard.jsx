import styles from './MemberCard.module.css';

export function MemberCard({ member, onEdit, onDelete, onResend, onRenew, onWhatsApp, onQuickPayment }) {
  const endDate = new Date(member.subscription_end);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = endDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getStatusBadge = () => {
    if (member.status === 'active') {
      return <span className={`${styles.badge} ${styles.active}`}>🟢 Active</span>;
    }
    if (member.status === 'expiring') {
      return <span className={`${styles.badge} ${styles.expiring}`}>🟡 Expiring</span>;
    }
    return <span className={`${styles.badge} ${styles.expired}`}>🔴 Expired</span>;
  };

  const getStatusColor = () => {
    if (member.status === 'active') return 'active';
    if (member.status === 'expiring') return 'expiring';
    return 'expired';
  };

  const amountPaid = Number(member.amount_paid || 0);
  const amountDue = Number(member.amount_due || 0);
  const lastVisit = member.last_visit ? new Date(member.last_visit).toLocaleDateString() : 'No visits yet';

  return (
    <div className={`${styles.card} ${styles[getStatusColor()]}`}>
      <div className={styles.header}>
        <div>
          <h3>{member.name}</h3>
          <p className={styles.plan}>{member.subscription_type}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.label}>📧 Email</span>
          <span className={styles.value}>{member.email}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>📱 Phone</span>
          <span className={styles.value}>{member.phone}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>📅 Start</span>
          <span className={styles.value}>{new Date(member.subscription_start).toLocaleDateString()}</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>📅 End</span>
          <span className={styles.value}>{new Date(member.subscription_end).toLocaleDateString()}</span>
        </div>
      </div>

      <div className={styles.daysLeft}>
        <span className={styles.daysLabel}>Days Remaining:</span>
        <span className={`${styles.days} ${daysLeft <= 1 ? styles.critical : ''}`}>
          {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : daysLeft > 0 ? `${daysLeft} days` : 'Expires today'}
        </span>
      </div>

      <div className={styles.businessInfo}>
        <div>
          <span>Paid</span>
          <strong>₹{amountPaid.toLocaleString('en-IN')}</strong>
        </div>
        <div className={amountDue > 0 ? styles.due : styles.clear}>
          <span>Due</span>
          <strong>₹{amountDue.toLocaleString('en-IN')}</strong>
        </div>
        <div>
          <span>Last Visit</span>
          <strong>{lastVisit}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(member)}>✎ Edit</button>
        <button className={styles.deleteBtn} onClick={() => onDelete(member)}>🗑 Delete</button>
        <button className={styles.renewBtn} onClick={() => onRenew(member)}>🔄 Renew</button>
        {typeof onQuickPayment !== 'undefined' && amountDue > 0 ? (
          <button className={styles.paymentBtn} onClick={() => onQuickPayment(member)}>Mark Paid</button>
        ) : null}
        {typeof onWhatsApp !== 'undefined' ? (
          <button className={styles.whatsappBtn} onClick={() => onWhatsApp(member, 'welcome')}>WhatsApp</button>
        ) : null}
        {typeof onResend !== 'undefined' ? (
          <button className={styles.resendBtn} onClick={() => onResend(member, 'both')}>↻ Resend</button>
        ) : null}
      </div>
    </div>
  );
}
