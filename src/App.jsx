import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import AdminLayout from './layouts/AdminLayout';
import Home        from './pages/Home/Home';
import Dashboard   from './pages/Admin/Dashboard';
import Login       from './pages/Auth/Login';
import Signup      from './pages/Auth/Signup';

const Placeholder = ({ title }) => (
    <div style={{ padding: '20px' }}>
        <h2 style={{ color: '#2b3053' }}>{title} Page</h2>
        <p style={{ marginTop: '10px', color: '#666' }}>This feature is under development.</p>
    </div>
);

function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        // Not logged in — go to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const userRoleLower = user.role?.toLowerCase() ?? '';
        const allowed = allowedRoles.map(r => r.toLowerCase());
        if (!allowed.includes(userRoleLower)) {
            // Logged in but wrong role
            return <Navigate to="/" replace />;
        }
    }

    return children;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/"       element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin + Staff protected */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />

                <Route path="staff/directory" element={<Placeholder title="Staff Directory" />} />
                <Route path="staff/register"  element={<Placeholder title="Register New Staff" />} />

                <Route path="inventory/parts"     element={<Placeholder title="Vehicle Parts Inventory" />} />
                <Route path="inventory/vendors"   element={<Placeholder title="Vendor Management" />} />
                <Route path="inventory/purchases" element={<Placeholder title="Purchase Invoices" />} />

                <Route path="reports/daily"   element={<Placeholder title="Daily Financial Reports" />} />
                <Route path="reports/monthly" element={<Placeholder title="Monthly Financial Reports" />} />
                <Route path="reports/yearly"  element={<Placeholder title="Yearly Financial Reports" />} />

                <Route path="settings/profile" element={<Placeholder title="Admin Profile" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;