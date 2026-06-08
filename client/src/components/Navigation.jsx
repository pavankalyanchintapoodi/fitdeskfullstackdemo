import styles from './Navigation.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.icon}>💪</span>
          <span className={styles.title}>FitDesk</span>
        </div>
        <ul className={styles.links}>
          <li>
            <Link
              to="/dashboard"
              className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/members"
              className={`${styles.link} ${isActive('/members') ? styles.active : ''}`}
            >
              👥 Members
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className={`${styles.link} ${isActive('/notifications') ? styles.active : ''}`}
            >
              🔔 Notifications
            </Link>
          </li>
        </ul>
        <div className={styles.userSection}>
          {user && <span className={styles.userName}>{user.name}</span>}
          <button className={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>
    </nav>
  );
}
