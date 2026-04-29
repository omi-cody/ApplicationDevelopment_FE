import './Admin.css';

export default function Dashboard() {
    const parts = [
        { id: 101, name: 'Brake Pads (Honda)', stock: 4, vendor: 'AutoParts Co.' },
        { id: 102, name: 'Engine Oil (Motul 10W-40)', stock: 2, vendor: 'Lubricants Inc.' },
        { id: 103, name: 'Chain Sprocket Kit', stock: 24, vendor: 'AutoParts Co.' },
        { id: 105, name: 'Spark Plug (NGK)', stock: 8, vendor: 'Ignition Systems Ltd.' },
    ];
    const lowStockItems = parts.filter((item) => item.stock < 10);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="admin-page-title">Dashboard Overview</h1>
            </div>

            {lowStockItems.length > 0 && (
                <div className="admin-card admin-alert-card">
                    <h2 className="admin-card-title admin-alert-title">Low Stock Alert</h2>
                    <p className="admin-alert-copy">
                        The following items have dropped below the threshold of 10 units. Please create a purchase invoice.
                    </p>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Part ID</th>
                                    <th>Part Name</th>
                                    <th>Current Stock</th>
                                    <th>Vendor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td className="cell-strong">{item.name}</td>
                                        <td><span className="badge badge-red">{item.stock} Units</span></td>
                                        <td>{item.vendor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="admin-stats-grid">
                <div className="admin-card">
                    <h3 className="admin-card-title">Total Sales (Today)</h3>
                    <p className="admin-stat-value">Rs. 45,200</p>
                </div>
                <div className="admin-card">
                    <h3 className="admin-card-title">Pending Appointments</h3>
                    <p className="admin-stat-value">12</p>
                </div>
                <div className="admin-card">
                    <h3 className="admin-card-title">Active Staff</h3>
                    <p className="admin-stat-value">8</p>
                </div>
            </div>
        </div>
    );
}
