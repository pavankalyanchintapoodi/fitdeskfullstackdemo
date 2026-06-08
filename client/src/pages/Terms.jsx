import { Link } from 'react-router-dom';
import styles from './Legal.module.css';

export function Terms() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/">FitDesk</Link>
        <Link to="/register">Start Free</Link>
      </nav>
      <article className={styles.article}>
        <h1>Terms & Conditions</h1>
        <p className={styles.updated}>Last updated: June 1, 2026</p>

        <section>
          <h2>Use Of FitDesk</h2>
          <p>FitDesk is provided to help fitness businesses manage member records, subscriptions, dues, and follow-ups. Users are responsible for the accuracy of the information they enter.</p>
        </section>

        <section>
          <h2>Account Responsibility</h2>
          <p>Gym owners must keep login credentials secure and ensure only authorized staff access member information.</p>
        </section>

        <section>
          <h2>Member Communication</h2>
          <p>Email and WhatsApp features are provided for operational communication. Users must follow applicable consent, privacy, and messaging rules in their region.</p>
        </section>

        <section>
          <h2>Payments And Records</h2>
          <p>FitDesk stores payment records for tracking purposes. It does not process payments directly unless a future payment gateway is integrated.</p>
        </section>

        <section>
          <h2>Availability</h2>
          <p>Production availability depends on the hosting provider, database setup, email provider, and deployment configuration.</p>
        </section>

        <section>
          <h2>Limitation</h2>
          <p>FitDesk should be used as an operational tool. Owners should maintain backups and verify important financial records.</p>
        </section>
      </article>
    </main>
  );
}
