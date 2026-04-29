import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home/Home';
import Dashboard from './pages/Admin/Dashboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dummy component so the other links don't crash when clicked
const Placeholder = ({ title }) => (
    <div style={{ padding: '20px' }}>
        <h2 style={{ color: '#2b3053' }}>{title} Page</h2>
        <p style={{ marginTop: '10px', color: '#666' }}>This feature is under development for the next milestone.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Home Route */}
                <Route path="/" element={<Home />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Admin Routes wrapped in the Admin Sidebar Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />

                    {/* Staff Routes */}
                    <Route path="staff/directory" element={<Placeholder title="Staff Directory" />} />
                    <Route path="staff/register" element={<Placeholder title="Register New Staff" />} />

                    {/* Inventory Routes */}
                    <Route path="inventory/parts" element={<Placeholder title="Vehicle Parts Inventory" />} />
                    <Route path="inventory/vendors" element={<Placeholder title="Vendor Management" />} />
                    <Route path="inventory/purchases" element={<Placeholder title="Purchase Invoices" />} />

                    {/* Report Routes */}
                    <Route path="reports/daily" element={<Placeholder title="Daily Financial Reports" />} />
                    <Route path="reports/monthly" element={<Placeholder title="Monthly Financial Reports" />} />
                    <Route path="reports/yearly" element={<Placeholder title="Yearly Financial Reports" />} />

                    {/* Settings Routes */}
                    <Route path="settings/profile" element={<Placeholder title="Admin Profile" />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
