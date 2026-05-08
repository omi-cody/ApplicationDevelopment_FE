import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Navbar from '../components/Admin/Navbar';
import '../pages/Admin/Admin.css';

export default function AdminLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className={`admin-layout${isSidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
            <div className="admin-shell">
                <Navbar onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
