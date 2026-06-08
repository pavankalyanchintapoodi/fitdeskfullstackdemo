import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { StatCard } from '../components/StatCard';
import { AlertBanner } from '../components/AlertBanner';
import { ToastContainer } from '../components/Toast';
import { statsAPI } from '../api/api';
import { useToast } from '../hooks/useToast';
import { useSocket, useSocketEvents } from '../hooks/useSocket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();
  const { socket } = useSocket();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      showToast('Failed to load statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useSocketEvents(socket, {
    'client:created': () => {
      fetchStats();
      showToast('New member added', 'success');
    },
    'client:updated': () => {
      fetchStats();
      showToast('Member updated', 'success');
    },
    'client:deleted': () => {
      fetchStats();
      showToast('Member deleted', 'success');
    },
  });

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const chartData = stats?.planTypes || [];
  const hasAlert = stats?.expiringToday > 0 || stats?.expiringTomorrow > 0;
  let alertMessage = '';
  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

  if (stats?.expiringToday > 0 && stats?.expiringTomorrow > 0) {
    alertMessage = `⚠️ ${stats.expiringToday} member(s) expire today and ${stats.expiringTomorrow} expire tomorrow!`;
  } else if (stats?.expiringToday > 0) {
    alertMessage = `⚠️ ${stats.expiringToday} member(s) expire today!`;
  } else if (stats?.expiringTomorrow > 0) {
    alertMessage = `⚠️ ${stats.expiringTomorrow} member(s) expire tomorrow!`;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>Gym membership overview and analytics</p>
        </div>

        {hasAlert && (
          <AlertBanner
            title="Membership Alert"
            message={alertMessage}
            type="warning"
          />
        )}

        <div className={styles.statsGrid}>
          <StatCard
            title="Total Members"
            value={stats?.total || 0}
            icon="👥"
            color="primary"
          />
          <StatCard
            title="Active"
            value={stats?.active || 0}
            icon="✓"
            color="success"
          />
          <StatCard
            title="Expiring Soon"
            value={stats?.expiring || 0}
            icon="⏱"
            color="warning"
          />
          <StatCard
            title="Expired"
            value={stats?.expired || 0}
            icon="✕"
            color="danger"
          />
          <StatCard
            title="Revenue Collected"
            value={formatCurrency(stats?.totalPaid)}
            icon="₹"
            color="success"
          />
          <StatCard
            title="Amount Due"
            value={formatCurrency(stats?.totalDue)}
            icon="!"
            color="warning"
          />
          <StatCard
            title="Inactive 7+ Days"
            value={stats?.inactive7Days || 0}
            icon="⏳"
            color="danger"
          />
        </div>

        <div className={styles.chartContainer}>
          <h2>Members by Plan Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f1520', border: '1px solid #1a2332' }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend wrapperStyle={{ color: '#a0aec0' }} />
              <Bar dataKey="count" fill="#3d8bff" name="Count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
