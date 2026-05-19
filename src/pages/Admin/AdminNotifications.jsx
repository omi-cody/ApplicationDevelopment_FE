import { useEffect, useState } from 'react';
import './Admin.css';
import { api } from '../../lib/api';

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const unreadCount = notifications.filter((item) => !item.isRead).length;
    const lowStockCount = notifications.filter((item) => item.type === 'LowStock').length;
    const creditCount = notifications.filter((item) => item.type === 'CreditReminder').length;

    async function loadNotifications() {
        setLoading(true);
        setError('');
        try {
            setNotifications(await api.getAdminNotifications(200));
        } catch (err) {
            setError(err.message || 'Unable to load notifications.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNotifications();
    }, []);

    async function runLowStock() {
        setWorking(true);
        setError('');
        setMessage('');
        try {
            const result = await api.runLowStockNotifications();
            setMessage(`Generated ${result.generated ?? 0} low-stock notification(s).`);
            await loadNotifications();
        } catch (err) {
            setError(err.message || 'Unable to run low-stock notifications.');
        } finally {
            setWorking(false);
        }
    }

    async function runOverdueCredits() {
        setWorking(true);
        setError('');
        setMessage('');
        try {
            const result = await api.runOverdueCreditNotifications();
            setMessage(`Generated ${result.generated ?? 0} overdue-credit notification(s).`);
            await loadNotifications();
        } catch (err) {
            setError(err.message || 'Unable to run overdue-credit reminders.');
        } finally {
            setWorking(false);
        }
    }

    async function markAllRead() {
        setWorking(true);
        setError('');
        setMessage('');
        try {
            const result = await api.markAllNotificationsRead();
            setMessage(`Marked ${result.updated ?? 0} notification(s) as read.`);
            await loadNotifications();
        } catch (err) {
            setError(err.message || 'Unable to mark notifications as read.');
        } finally {
            setWorking(false);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Alerts</h1>
                    <p className="admin-page-subtitle">Track stock warnings and customer credit follow-up in one place.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={runLowStock} disabled={working}>
                        {working ? 'Running...' : 'Generate Stock Alerts'}
                    </button>
                    <button className="btn-primary" onClick={runOverdueCredits} disabled={working}>
                        {working ? 'Running...' : 'Send Credit Reminders'}
                    </button>
                    <button className="btn-link" onClick={markAllRead} disabled={working}>
                        Mark All Read
                    </button>
                </div>
            </div>

            {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
            {message ? <p style={{ color: '#166534' }}>{message}</p> : null}

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Overview</div>
                <div className="admin-stats-inline" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <span className="admin-stat-pill">Unread <strong>{unreadCount}</strong></span>
                    <span className="admin-stat-pill">Stock Alerts <strong>{lowStockCount}</strong></span>
                    <span className="admin-stat-pill">Credit Reminders <strong>{creditCount}</strong></span>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Recent Alerts</div>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Message</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4}>Loading notifications...</td></tr>
                            ) : notifications.length === 0 ? (
                                <tr><td colSpan={4}>No notifications yet.</td></tr>
                            ) : notifications.map((item) => (
                                <tr key={item.id}>
                                    <td>{new Date(item.sentAt).toLocaleString()}</td>
                                    <td>{item.type}</td>
                                    <td>{item.message}</td>
                                    <td>
                                        <span className={`badge ${item.isRead ? 'badge-green' : 'badge-orange'}`}>
                                            {item.isRead ? 'Read' : 'Unread'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
