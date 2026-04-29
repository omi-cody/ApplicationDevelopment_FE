import { useState } from 'react';
import './Admin.css';

export default function StaffManagement() {
    const [staffList] = useState([
        { id: 1, name: 'Aaryan Jha', email: 'aaryan@bike360.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Sita Sharma', email: 'sita@bike360.com', role: 'Staff', status: 'Active' },
        { id: 3, name: 'Rahul Thapa', email: 'rahul@bike360.com', role: 'Staff', status: 'Inactive' },
    ]);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Staff Management</h1>
                    <p className="admin-page-subtitle">Manage employee roles and system access.</p>
                </div>
                <button className="btn-primary">+ Register New Staff</button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.id}>
                                    <td>#{staff.id}</td>
                                    <td className="cell-strong">{staff.name}</td>
                                    <td>{staff.email}</td>
                                    <td>
                                        <span className={`badge ${staff.role === 'Admin' ? 'badge-orange' : 'badge-blue'}`}>
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-dot ${staff.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                            {staff.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-danger">Revoke Access</button>
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
