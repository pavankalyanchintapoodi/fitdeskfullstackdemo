import styles from './Toast.module.css';

export function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        {type === 'success' && <span>✓</span>}
        {type === 'error' && <span>✕</span>}
        {type === 'warning' && <span>⚠</span>}
        <p>{message}</p>
      </div>
      <button className={styles.close} onClick={onClose}>×</button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
}

