import { useState } from 'react';
import './Admin.css';

export default function Vendors() {
    const [vendors] = useState([
        { id: 'V-01', name: 'AutoParts Co.', contactPerson: 'Ramesh Singh', phone: '9841234567', status: 'Active' },
        { id: 'V-02', name: 'Lubricants Inc.', contactPerson: 'Bikash Tamang', phone: '9812345678', status: 'Active' },
        { id: 'V-03', name: 'Ignition Systems Ltd.', contactPerson: 'Hari Karki', phone: '9801122334', status: 'Inactive' },
    ]);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Vendor Management</h1>
                    <p className="admin-page-subtitle">Manage suppliers and wholesale distributors.</p>
                </div>
                <button className="btn-primary">+ Add Vendor</button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Vendor ID</th>
                                <th>Company Name</th>
                                <th>Contact Person</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td>{vendor.id}</td>
                                    <td className="cell-strong">{vendor.name}</td>
                                    <td>{vendor.contactPerson}</td>
                                    <td>{vendor.phone}</td>
                                    <td>
                                        <span className={`badge ${vendor.status === 'Active' ? 'badge-blue' : 'badge-red'}`}>
                                            {vendor.status}
                                        </span>
                                    </td>
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
