import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Navbar from '../components/Admin/Navbar';
import '../pages/Admin/Admin.css';

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-shell">
                <Navbar />
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
