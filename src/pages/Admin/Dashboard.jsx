import {
    BarElement,
    Chart as ChartJS,
    CategoryScale,
    Filler,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './Admin.css';
import { api } from '../../lib/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

function toIsoDate(date) {
    return date.toISOString().split('T')[0];
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [trendLabels, setTrendLabels] = useState([]);
    const [trendValues, setTrendValues] = useState([]);
    const [trendSalesCounts, setTrendSalesCounts] = useState([]);
    const [trendPurchaseCounts, setTrendPurchaseCounts] = useState([]);
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [metrics, setMetrics] = useState({
        staffCount: 0,
        vendorCount: 0,
        partCount: 0,
        purchaseInvoiceCount: 0,
        lowStockCount: 0,
        overdueCount: 0,
        dailyNetRevenue: 0,
    });

    useEffect(() => {
        async function loadDashboard() {
            setLoading(true);
            setError('');
            try {
                const today = new Date();
                const dates = Array.from({ length: 7 }, (_, index) => {
                    const d = new Date(today);
                    d.setDate(today.getDate() - (6 - index));
                    return d;
                });
                const dateKeys = dates.map((d) => toIsoDate(d));

                const [staff, vendors, parts, purchases, lowStock, overdue, daily] = await Promise.all([
                    api.getStaff(),
                    api.getVendors(),
                    api.getParts(),
                    api.getPurchaseInvoices(),
                    api.getLowStockReport(),
                    api.getOverdueCreditsReport(),
                    api.getDailyReport(toIsoDate(today)),
                ]);

                const trendReports = await Promise.all(
                    dateKeys.map((dateKey) => api.getDailyReport(dateKey)),
                );

                setMetrics({
                    staffCount: staff.length,
                    vendorCount: vendors.length,
                    partCount: parts.length,
                    purchaseInvoiceCount: purchases.length,
                    lowStockCount: lowStock.length,
                    overdueCount: overdue.length,
                    dailyNetRevenue: daily.netRevenue || 0,
                });
                setTrendLabels(dates.map((d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })));
                setTrendValues(trendReports.map((item) => Number(item.netRevenue || 0)));
                setTrendSalesCounts(trendReports.map((item) => Number(item.salesInvoiceCount || 0)));
                setTrendPurchaseCounts(trendReports.map((item) => Number(item.purchaseInvoiceCount || 0)));
                setRecentPurchases(purchases.slice(0, 5));
            } catch (err) {
                setError(err.message || 'Unable to load dashboard metrics.');
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const trendData = useMemo(() => ({
        labels: trendLabels,
        datasets: [
            {
                label: 'Net Revenue',
                data: trendValues,
                borderColor: '#ff751f',
                tension: 0.34,
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return 'rgba(255,117,31,0.18)';
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(255,117,31,0.30)');
                    gradient.addColorStop(1, 'rgba(255,117,31,0.02)');
                    return gradient;
                },
            },
        ],
    }), [trendLabels, trendValues]);

    const trendOptions = useMemo(() => ({
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                grid: { color: '#eef1f8' },
                ticks: { color: '#8d97b2', font: { size: 11, family: 'Manrope' } },
                border: { display: false },
            },
            y: {
                grid: { color: '#eef1f8' },
                ticks: { color: '#8d97b2', font: { size: 11, family: 'Manrope' } },
                border: { display: false },
            },
        },
    }), []);

    const activityData = useMemo(() => ({
        labels: trendLabels,
        datasets: [
            {
                label: 'Sales Invoices',
                data: trendSalesCounts,
                backgroundColor: '#ff9c5b',
                borderRadius: 10,
                maxBarThickness: 24,
            },
            {
                label: 'Purchase Invoices',
                data: trendPurchaseCounts,
                backgroundColor: '#3563e9',
                borderRadius: 10,
                maxBarThickness: 24,
            },
        ],
    }), [trendLabels, trendPurchaseCounts, trendSalesCounts]);

    const activityOptions = useMemo(() => ({
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#5a6484',
                    font: { family: 'Manrope', size: 11, weight: '600' },
                    usePointStyle: true,
                    boxWidth: 10,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#8d97b2', font: { size: 11, family: 'Manrope' } },
                border: { display: false },
            },
            y: {
                beginAtZero: true,
                grid: { color: '#eef1f8' },
                ticks: { color: '#8d97b2', font: { size: 11, family: 'Manrope' }, precision: 0 },
                border: { display: false },
            },
        },
    }), []);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Admin Dashboard</h1>
                    <p className="admin-page-subtitle">A live view of staff, stock, purchasing, alerts, and daily performance.</p>
                </div>
            </div>

            {error ? <div className="admin-page-alert admin-page-alert-error">{error}</div> : null}

            <section className="admin-kpi-grid admin-kpi-grid-five" style={{ marginBottom: '16px' }}>
                <article className="admin-kpi-card">
                    <p>Staff Accounts</p>
                    <h3>{loading ? '...' : metrics.staffCount}</h3>
                </article>
                <article className="admin-kpi-card">
                    <p>Vendors</p>
                    <h3>{loading ? '...' : metrics.vendorCount}</h3>
                </article>
                <article className="admin-kpi-card">
                    <p>Parts in Catalog</p>
                    <h3>{loading ? '...' : metrics.partCount}</h3>
                </article>
                <article className="admin-kpi-card">
                    <p>Purchase Invoices</p>
                    <h3>{loading ? '...' : metrics.purchaseInvoiceCount}</h3>
                </article>
                <article className="admin-kpi-card">
                    <p>Today Net Revenue</p>
                    <h3>Rs. {loading ? '...' : Number(metrics.dailyNetRevenue).toLocaleString()}</h3>
                </article>
            </section>

            <section className="admin-analytics-grid" style={{ marginBottom: '16px' }}>
                <article className="admin-panel">
                    <div className="admin-panel-head">
                        <h2>Critical Alerts</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span className={`badge ${metrics.lowStockCount > 0 ? 'badge-red' : 'badge-green'}`}>
                            Low Stock Items: {loading ? '...' : metrics.lowStockCount}
                        </span>
                        <span className={`badge ${metrics.overdueCount > 0 ? 'badge-orange' : 'badge-green'}`}>
                            Overdue Credit Cases: {loading ? '...' : metrics.overdueCount}
                        </span>
                    </div>
                    <div className="admin-dashboard-actions">
                        <Link className="btn-primary" to="/admin/notifications">Manage Alerts</Link>
                        <Link className="btn-ghost" to="/admin/reports/daily">View Reports</Link>
                    </div>
                </article>

                <article className="admin-panel admin-sales-panel">
                    <div className="admin-panel-head">
                        <div>
                            <h2>7-Day Net Revenue Trend</h2>
                            <p>Today: Rs. {loading ? '...' : Number(metrics.dailyNetRevenue).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="admin-chart-wrap">
                        <Line data={trendData} options={trendOptions} />
                    </div>
                </article>
                <article className="admin-panel">
                    <div className="admin-panel-head">
                        <div>
                            <h2>Weekly Invoice Activity</h2>
                            <p>Sales versus purchase invoices across the last 7 days.</p>
                        </div>
                    </div>
                    <div className="admin-chart-wrap">
                        <Bar data={activityData} options={activityOptions} />
                    </div>
                </article>
            </section>

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Quick Actions</div>
                <div className="admin-dashboard-actions">
                    <Link className="btn-primary" to="/admin/staff/directory">Staff</Link>
                    <Link className="btn-primary" to="/admin/inventory/parts">Parts</Link>
                    <Link className="btn-primary" to="/admin/inventory/vendors">Vendors</Link>
                    <Link className="btn-primary" to="/admin/inventory/purchases">Create Purchase Invoices</Link>
                    <Link className="btn-primary" to="/admin/reports/daily">Reports</Link>
                    <Link className="btn-primary" to="/admin/notifications">Alerts</Link>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Recent Purchase Invoices</div>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4}>Loading invoices...</td></tr>
                            ) : recentPurchases.length === 0 ? (
                                <tr><td colSpan={4}>No purchase invoices available.</td></tr>
                            ) : recentPurchases.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="cell-strong">{invoice.invoiceNumber}</td>
                                    <td>{new Date(invoice.purchaseDate).toLocaleDateString()}</td>
                                    <td>{invoice.status}</td>
                                    <td>Rs. {Number(invoice.totalAmount).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
