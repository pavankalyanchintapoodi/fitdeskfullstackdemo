import styles from './AlertBanner.module.css';

export function AlertBanner({ title, message, type = 'warning' }) {
  return (
    <div className={`${styles.banner} ${styles[type]}`}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

