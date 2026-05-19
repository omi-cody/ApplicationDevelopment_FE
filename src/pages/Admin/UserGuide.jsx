import { Link } from 'react-router-dom';
import './Admin.css';

const guideSteps = [
    'Register staff members and assign role (Admin/Staff).',
    'Add vendors and maintain supplier contact information.',
    'Create parts and maintain stock, pricing, and low-stock threshold.',
    'Create purchase invoices to increase stock automatically.',
    'Review daily/monthly/yearly financial reports.',
    'Use alerts to review low-stock items and overdue credit reminders.',
];

export default function UserGuide() {
    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Operations Guide</h1>
                    <p className="admin-page-subtitle">Recommended operating flow for staff, purchasing, reporting, and alerts.</p>
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Recommended Workflow</div>
                <ol style={{ margin: 0, paddingLeft: '18px', color: '#111827', lineHeight: 1.7 }}>
                    {guideSteps.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Quick Links</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link className="btn-primary" to="/admin/staff/directory">Staff Management</Link>
                    <Link className="btn-primary" to="/admin/inventory/parts">Parts Inventory</Link>
                    <Link className="btn-primary" to="/admin/inventory/vendors">Vendors</Link>
                    <Link className="btn-primary" to="/admin/inventory/purchases">Purchase Invoices</Link>
                    <Link className="btn-primary" to="/admin/reports/daily">Financial Reports</Link>
                    <Link className="btn-primary" to="/admin/notifications">System Notifications</Link>
                </div>
            </div>
        </div>
    );
}
