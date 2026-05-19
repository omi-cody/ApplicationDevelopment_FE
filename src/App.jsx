import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home/Home';
import Dashboard from './pages/Admin/Dashboard';
import StaffManagement from './pages/Admin/StaffManagement';
import RegisterStaff from './pages/Admin/RegisterStaff';
import Inventory from './pages/Admin/Inventory';
import Vendors from './pages/Admin/Vendors';
import Purchases from './pages/Admin/Purchases';
import FinancialReports from './pages/Admin/FinancialReports';
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminProfile from './pages/Admin/AdminProfile';
import ServicePricing from './pages/Admin/ServicePricing';
import UserGuide from './pages/Admin/UserGuide';
import HelpCenter from './pages/Admin/HelpCenter';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { isAuthenticated } from './lib/auth';

function AdminGuard({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                    path="/admin"
                    element={(
                        <AdminGuard>
                            <AdminLayout />
                        </AdminGuard>
                    )}
                >
                    <Route index element={<Dashboard />} />
                    <Route path="staff/directory" element={<StaffManagement />} />
                    <Route path="staff/register" element={<RegisterStaff />} />
                    <Route path="inventory/parts" element={<Inventory />} />
                    <Route path="inventory/vendors" element={<Vendors />} />
                    <Route path="inventory/purchases" element={<Purchases />} />
                    <Route path="reports/daily" element={<FinancialReports mode="daily" />} />
                    <Route path="reports/monthly" element={<FinancialReports mode="monthly" />} />
                    <Route path="reports/yearly" element={<FinancialReports mode="yearly" />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="settings/profile" element={<AdminProfile />} />
                    <Route path="settings/service-pricing" element={<ServicePricing />} />
                    <Route path="support/guide" element={<UserGuide />} />
                    <Route path="support/help" element={<HelpCenter />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
