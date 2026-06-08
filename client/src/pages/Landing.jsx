import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const features = [
  ['Member CRM', 'Save profiles, plans, dates, dues, and follow-up details in one place.'],
  ['Renewal Control', 'See active, expiring, and expired members before revenue slips away.'],
  ['Payment Tracking', 'Record paid amounts, pending dues, and payment modes for every member.'],
  ['WhatsApp Follow-Up', 'Open ready-to-send WhatsApp messages without paid SMS setup.'],
  ['Owner Dashboard', 'Track members, revenue, dues, and plan mix from a single view.'],
  ['CSV Export', 'Export customer and payment data for backup or reporting.']
];

export function Landing() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>💪 FitDesk</Link>
        <div className={styles.navLinks}>
          <Link to="/login">Login</Link>
          <Link to="/register" className={styles.navCta}>Start Free</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>FitDesk</h1>
          <p className={styles.lead}>
            Member, payment, and renewal management for gyms and fitness studios.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.primaryBtn}>Start Managing Members</Link>
            <Link to="/login" className={styles.secondaryBtn}>Owner Login</Link>
          </div>
        </div>
        <div className={styles.heroPanel} aria-label="FitDesk dashboard preview">
          <div className={styles.metricRow}>
            <span>Total Members</span>
            <strong>248</strong>
          </div>
          <div className={styles.metricRow}>
            <span>Amount Due</span>
            <strong>₹42,500</strong>
          </div>
          <div className={styles.metricRow}>
            <span>Expiring Soon</span>
            <strong>18</strong>
          </div>
          <div className={styles.followUp}>
            <span>Today&apos;s Focus</span>
            <p>Renewals, dues, and WhatsApp follow-ups ready.</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        {features.map(([title, description]) => (
          <article key={title} className={styles.feature}>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className={styles.pitch}>
        <h2>Built for daily gym operations</h2>
        <p>
          FitDesk helps owners replace notebooks, scattered spreadsheets, and missed WhatsApp follow-ups with a focused workflow for members, money, and renewals.
        </p>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} FitDesk</span>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
