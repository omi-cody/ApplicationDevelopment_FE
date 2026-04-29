import { useState } from 'react';
import './Admin.css';

export default function Inventory() {
    const [parts] = useState([
        { id: 'P-101', name: 'Brake Pads (Honda)', category: 'Braking', vendor: 'AutoParts Co.', stock: 4, price: 2200 },
        { id: 'P-102', name: 'Engine Oil (Motul 10W-40)', category: 'Lubricants', vendor: 'Lubricants Inc.', stock: 2, price: 1650 },
        { id: 'P-103', name: 'Chain Sprocket Kit', category: 'Drivetrain', vendor: 'AutoParts Co.', stock: 24, price: 5400 },
        { id: 'P-105', name: 'Spark Plug (NGK)', category: 'Ignition', vendor: 'Ignition Systems Ltd.', stock: 8, price: 650 },
    ]);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Vehicle Parts Inventory</h1>
                    <p className="admin-page-subtitle">Manage part records, vendor linkage, pricing, and stock levels.</p>
                </div>
                <button className="btn-primary">+ Add Part</button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Part ID</th>
                                <th>Part Name</th>
                                <th>Category</th>
                                <th>Vendor</th>
                                <th>Stock</th>
                                <th>Unit Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.map((part) => (
                                <tr key={part.id}>
                                    <td>{part.id}</td>
                                    <td className="cell-strong">{part.name}</td>
                                    <td>{part.category}</td>
                                    <td>{part.vendor}</td>
                                    <td>
                                        <span className={`badge ${part.stock < 10 ? 'badge-red' : 'badge-green'}`}>
                                            {part.stock} Units
                                        </span>
                                    </td>
                                    <td>Rs. {part.price.toLocaleString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-link">Edit</button>
                                            <button className="btn-link btn-link-danger">Delete</button>
                                        </div>
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
