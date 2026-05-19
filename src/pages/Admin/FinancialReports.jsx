import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './Admin.css';
import { api } from '../../lib/api';

const currentDate = new Date();

export default function FinancialReports({ mode = 'daily' }) {
    const [report, setReport] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [overdue, setOverdue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [runningJob, setRunningJob] = useState(false);

    const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());

    const title = useMemo(() => {
        if (mode === 'monthly') return 'Monthly Financial Reports';
        if (mode === 'yearly') return 'Yearly Financial Reports';
        return 'Daily Financial Reports';
    }, [mode]);

    async function load() {
        setLoading(true);
        setError('');
        try {
            const reportPromise = mode === 'monthly'
                ? api.getMonthlyReport(year, month)
                : mode === 'yearly'
                    ? api.getYearlyReport(year)
                    : api.getDailyReport(dailyDate);

            const [reportData, lowStockData, overdueData] = await Promise.all([
                reportPromise,
                api.getLowStockReport(),
                api.getOverdueCreditsReport(),
            ]);

            setReport(reportData);
            setLowStock(lowStockData);
            setOverdue(overdueData);
        } catch (err) {
            setError(err.message || 'Unable to load financial reports.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [mode, dailyDate, month, year]);

    async function runLowStockJob() {
        setRunningJob(true);
        setError('');
        setMessage('');
        try {
            const result = await api.runLowStockNotifications();
            setMessage(`Generated ${result.generated ?? 0} low-stock notification(s).`);
            await load();
        } catch (err) {
            setError(err.message || 'Unable to run low-stock job.');
        } finally {
            setRunningJob(false);
        }
    }

    async function runOverdueJob() {
        setRunningJob(true);
        setError('');
        setMessage('');
        try {
            const result = await api.runOverdueCreditNotifications();
            setMessage(`Generated ${result.generated ?? 0} overdue credit reminder(s).`);
            await load();
        } catch (err) {
            setError(err.message || 'Unable to run overdue credit reminders.');
        } finally {
            setRunningJob(false);
        }
    }

    function getReportPeriodLabel() {
        if (mode === 'monthly') return `${year}-${String(month).padStart(2, '0')}`;
        if (mode === 'yearly') return String(year);
        return dailyDate;
    }

    function exportToExcel() {
        if (!report) {
            setError('No report data available to export yet.');
            return;
        }

        setError('');
        setMessage('');

        const workbook = XLSX.utils.book_new();
        const summaryRows = [
            { Metric: 'Period', Value: getReportPeriodLabel() },
            { Metric: 'Sales Invoices', Value: report.salesInvoiceCount ?? 0 },
            { Metric: 'Purchase Invoices', Value: report.purchaseInvoiceCount ?? 0 },
            { Metric: 'Sales Total', Value: Number(report.salesTotal ?? 0) },
            { Metric: 'Purchase Total', Value: Number(report.purchaseTotal ?? 0) },
            { Metric: 'Net Revenue', Value: Number(report.netRevenue ?? 0) },
        ];
        const lowStockRows = lowStock.map((item) => ({
            PartNumber: item.partNumber,
            PartName: item.partName,
            Stock: item.stockQuantity,
            Threshold: item.threshold,
        }));
        const overdueRows = overdue.map((item) => ({
            Invoice: item.invoiceNumber,
            Customer: item.customerProfileId,
            Amount: Number(item.totalAmount ?? 0),
            DueDate: item.creditDueDate,
            DaysOverdue: item.daysOverdue,
        }));

        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), 'Summary');
        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(lowStockRows.length ? lowStockRows : [{ Info: 'No low stock alerts' }]),
            'Low Stock',
        );
        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(overdueRows.length ? overdueRows : [{ Info: 'No overdue credits' }]),
            'Overdue Credits',
        );

        XLSX.writeFile(workbook, `bike360-report-${mode}-${getReportPeriodLabel()}.xlsx`);
        setMessage('Excel report exported successfully.');
    }

    function printReport() {
        window.print();
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Reports</h1>
                    <p className="admin-page-subtitle">Review sales, purchases, stock pressure, and overdue credit follow-up.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn-ghost" onClick={exportToExcel} disabled={loading}>
                        Export Excel
                    </button>
                    <button className="btn-ghost" onClick={printReport} disabled={loading}>
                        Print Report
                    </button>
                    <button className="btn-primary" onClick={runLowStockJob} disabled={runningJob}>
                        {runningJob ? 'Running...' : 'Generate Stock Alerts'}
                    </button>
                    <button className="btn-primary" onClick={runOverdueJob} disabled={runningJob}>
                        {runningJob ? 'Running...' : 'Send Credit Reminders'}
                    </button>
                </div>
            </div>

            <div className="admin-segmented-tabs" style={{ marginBottom: '16px' }}>
                <NavLink to="/admin/reports/daily" className={({ isActive }) => `admin-tab-chip${isActive ? ' is-active' : ''}`}>Daily</NavLink>
                <NavLink to="/admin/reports/monthly" className={({ isActive }) => `admin-tab-chip${isActive ? ' is-active' : ''}`}>Monthly</NavLink>
                <NavLink to="/admin/reports/yearly" className={({ isActive }) => `admin-tab-chip${isActive ? ' is-active' : ''}`}>Yearly</NavLink>
            </div>

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">{title}</div>
                <div className="admin-form-grid">
                    {mode === 'daily' ? (
                        <div className="admin-field">
                            <label>Date</label>
                            <input type="date" className="admin-input" value={dailyDate} onChange={(e) => setDailyDate(e.target.value)} />
                        </div>
                    ) : null}
                    {mode === 'monthly' ? (
                        <>
                            <div className="admin-field"><label>Year</label><input type="number" className="admin-input" value={year} onChange={(e) => setYear(Number(e.target.value))} /></div>
                            <div className="admin-field"><label>Month</label><input type="number" min="1" max="12" className="admin-input" value={month} onChange={(e) => setMonth(Number(e.target.value))} /></div>
                        </>
                    ) : null}
                    {mode === 'yearly' ? (
                        <div className="admin-field"><label>Year</label><input type="number" className="admin-input" value={year} onChange={(e) => setYear(Number(e.target.value))} /></div>
                    ) : null}
                </div>
            </div>

            {error ? <div className="admin-page-alert admin-page-alert-error">{error}</div> : null}
            {message ? <div className="admin-page-alert admin-page-alert-success">{message}</div> : null}

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Summary</div>
                {loading ? (
                    <p>Loading report...</p>
                ) : report ? (
                    <div className="admin-stats-inline" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <span className="admin-stat-pill">Sales Invoices <strong>{report.salesInvoiceCount}</strong></span>
                        <span className="admin-stat-pill">Purchase Invoices <strong>{report.purchaseInvoiceCount}</strong></span>
                        <span className="admin-stat-pill">Sales Total <strong>Rs. {Number(report.salesTotal).toLocaleString()}</strong></span>
                        <span className="admin-stat-pill">Purchase Total <strong>Rs. {Number(report.purchaseTotal).toLocaleString()}</strong></span>
                        <span className="admin-stat-pill admin-stat-pill-active">Net Revenue <strong>Rs. {Number(report.netRevenue).toLocaleString()}</strong></span>
                    </div>
                ) : (
                    <p>No summary available.</p>
                )}
            </div>

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Low Stock Alerts</div>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Part Number</th>
                                <th>Name</th>
                                <th>Stock</th>
                                <th>Threshold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.length === 0 ? (
                                <tr><td colSpan={4}>No low stock alerts.</td></tr>
                            ) : lowStock.map((item) => (
                                <tr key={item.partId}>
                                    <td>{item.partNumber}</td>
                                    <td>{item.partName}</td>
                                    <td>{item.stockQuantity}</td>
                                    <td>{item.threshold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Overdue Credit Reminders</div>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Days Overdue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdue.length === 0 ? (
                                <tr><td colSpan={5}>No overdue credits.</td></tr>
                            ) : overdue.map((item) => (
                                <tr key={item.salesInvoiceId}>
                                    <td>{item.invoiceNumber}</td>
                                    <td>{item.customerProfileId.slice(0, 8)}</td>
                                    <td>Rs. {Number(item.totalAmount).toLocaleString()}</td>
                                    <td>{new Date(item.creditDueDate).toLocaleDateString()}</td>
                                    <td>{item.daysOverdue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
