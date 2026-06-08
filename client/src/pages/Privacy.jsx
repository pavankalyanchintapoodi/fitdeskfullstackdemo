import { Link } from 'react-router-dom';
import styles from './Legal.module.css';

export function Privacy() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/">FitDesk</Link>
        <Link to="/register">Start Free</Link>
      </nav>
      <article className={styles.article}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: June 1, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>FitDesk helps gym owners manage member, renewal, payment, and communication records. This policy explains what information the app stores and how it is used.</p>
        </section>

        <section>
          <h2>Information Stored</h2>
          <ul>
            <li>Owner account details such as name and email.</li>
            <li>Member details such as name, email, phone number, plan, dates, payment details, and visit information.</li>
            <li>Notification and renewal history used to operate the service.</li>
          </ul>
        </section>

        <section>
          <h2>How Information Is Used</h2>
          <p>Information is used to provide member management, renewals, payments, reports, email notifications, CSV exports, and WhatsApp follow-up links.</p>
        </section>

        <section>
          <h2>WhatsApp Links</h2>
          <p>FitDesk opens WhatsApp with a prefilled message. Messages are sent only when the owner confirms them in WhatsApp.</p>
        </section>

        <section>
          <h2>Data Protection</h2>
          <p>Production deployments should use strong passwords, secure environment variables, HTTPS hosting, database backups, and restricted admin access.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>For privacy questions, contact the FitDesk owner or administrator running this deployment.</p>
        </section>
      </article>
    </main>
  );
}
