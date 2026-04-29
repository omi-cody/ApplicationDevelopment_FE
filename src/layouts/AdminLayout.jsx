import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';

export default function AdminLayout() {
    return (
        <div className="admin-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* The Sidebar component on the left */}
            <Sidebar />

            {/* The main content area on the right where pages load */}
            <div className="admin-content" style={{ flex: 1, padding: '30px', overflowY: 'auto', backgroundColor: '#f4f6f9' }}>
                <Outlet />
            </div>
        </div>
    );
}