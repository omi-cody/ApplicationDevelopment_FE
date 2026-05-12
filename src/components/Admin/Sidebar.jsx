import { NavLink } from 'react-router-dom';
import {
    FiActivity,
    FiBarChart2,
    FiBookOpen,
    FiBox,
    FiDollarSign,
    FiGrid,
    FiHelpCircle,
    FiHome,
    FiMapPin,
    FiShoppingCart,
    FiTruck,
    FiUsers,
} from 'react-icons/fi';
import brandLogo from '../../assets/logo-primary.png';

const menuItems = [
    { label: 'Dashboard', to: '/admin', icon: FiHome, end: true },
    { label: 'Staff Directory', to: '/admin/staff/directory', icon: FiUsers },
    { label: 'Register Staff', to: '/admin/staff/register', icon: FiGrid },
    { label: 'Inventory', to: '/admin/inventory/parts', icon: FiBox },
    { label: 'Vendors', to: '/admin/inventory/vendors', icon: FiTruck },
    { label: 'Purchases', to: '/admin/inventory/purchases', icon: FiShoppingCart },
    { label: 'Financial Reports', to: '/admin/reports/daily', icon: FiBarChart2 },
    { label: 'Monthly Reports', to: '/admin/reports/monthly', icon: FiDollarSign },
    { label: 'Yearly Reports', to: '/admin/reports/yearly', icon: FiActivity },
    { label: 'Profile', to: '/admin/settings/profile', icon: FiMapPin },
];

export default function Sidebar({ isCollapsed = false }) {
    return (
        <aside className={`admin-sidebar${isCollapsed ? ' is-collapsed' : ''}`}>
            <div className="admin-sidebar-brand">
                <img src={brandLogo} alt="Bike360 logo" className="admin-sidebar-logo" />
                <div className="admin-sidebar-brand-copy">
                    <h2>Bike 360</h2>
                    <p>Admin Workspace</p>
                </div>
            </div>

            <nav className="admin-sidebar-nav" aria-label="Admin navigation">
                {menuItems.map(({ label, to, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `admin-sidebar-link${isActive ? ' is-active' : ''}`
                        }
                        title={isCollapsed ? label : undefined}
                    >
                        <Icon size={17} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="admin-sidebar-support">
                <button type="button" className="admin-support-link" title={isCollapsed ? 'User Guide' : undefined}>
                    <FiBookOpen size={16} />
                    <span>User Guide</span>
                </button>
                <button type="button" className="admin-support-link" title={isCollapsed ? 'Help Center' : undefined}>
                    <FiHelpCircle size={16} />
                    <span>Help Center</span>
                </button>
            </div>
        </aside>
    );
}
