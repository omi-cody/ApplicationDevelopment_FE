import './Admin.css';

export default function HelpCenter() {
    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Operations Notes</h1>
                    <p className="admin-page-subtitle">Quick reference for common admin flows and expected system behavior.</p>
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Common Issues</div>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.7 }}>
                    <li>If a create/update fails due to duplicate data, API now returns a clear 400/409 message.</li>
                    <li>Purchase invoice creation automatically increases stock for included parts.</li>
                    <li>Low-stock alerts are based on part threshold and current stock quantity.</li>
                    <li>Overdue credit reminders are generated for unpaid credit invoices older than one month.</li>
                </ul>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Endpoints Used by Admin Frontend</div>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.7 }}>
                    <li>`/api/admin/staff`</li>
                    <li>`/api/admin/vendors`</li>
                    <li>`/api/admin/parts`</li>
                    <li>`/api/admin/purchase-invoices`</li>
                    <li>`/api/admin/reports/daily|monthly|yearly`</li>
                    <li>`/api/admin/reports/low-stock`</li>
                    <li>`/api/admin/reports/overdue-credits`</li>
                    <li>`/api/admin/notifications`</li>
                </ul>
            </div>
        </div>
    );
}
