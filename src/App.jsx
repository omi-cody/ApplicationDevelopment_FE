import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home/Home';
import Dashboard from './pages/Admin/Dashboard';
import StaffManagement from './pages/Admin/StaffManagement';
import Inventory from './pages/Admin/Inventory';
import Vendors from './pages/Admin/Vendors';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

const Placeholder = ({ title }) => (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#111827' }}>{title}</h2>
        <p style={{ marginTop: '10px', color: '#6b7280' }}>This module is currently under development.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="staff/directory" element={<StaffManagement />} />
                    <Route path="staff/register" element={<Placeholder title="Register New Staff Form" />} />
                    <Route path="inventory/parts" element={<Inventory />} />
                    <Route path="inventory/vendors" element={<Vendors />} />
                    <Route path="inventory/purchases" element={<Placeholder title="Purchase Invoices" />} />
                    <Route path="reports/daily" element={<Placeholder title="Daily Financial Reports" />} />
                    <Route path="reports/monthly" element={<Placeholder title="Monthly Financial Reports" />} />
                    <Route path="reports/yearly" element={<Placeholder title="Yearly Financial Reports" />} />
                    <Route path="settings/profile" element={<Placeholder title="Admin Profile" />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
