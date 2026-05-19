import { NavLink } from 'react-router-dom';
import {
    FiActivity,
    FiBarChart2,
    FiBox,
    FiDollarSign,
    FiHome,
    FiMapPin,
    FiShoppingCart,
    FiTruck,
    FiBell,
    FiUserPlus,
    FiUsers,
} from 'react-icons/fi';
import brandLogo from '../../assets/logo-primary.png';

const menuItems = [
    { label: 'Dashboard', to: '/admin', icon: FiHome, end: true },
    { label: 'Staff Directory', to: '/admin/staff/directory', icon: FiUsers },
    { label: 'New Staff', to: '/admin/staff/register', icon: FiUserPlus },
    { label: 'Parts', to: '/admin/inventory/parts', icon: FiBox },
    { label: 'Vendors', to: '/admin/inventory/vendors', icon: FiTruck },
    { label: 'Purchases', to: '/admin/inventory/purchases', icon: FiShoppingCart },
    { label: 'Reports', to: '/admin/reports/daily', icon: FiBarChart2 },
    { label: 'Alerts', to: '/admin/notifications', icon: FiBell },
    { label: 'Service Pricing', to: '/admin/settings/service-pricing', icon: FiDollarSign },
    { label: 'Profile', to: '/admin/settings/profile', icon: FiMapPin },
];

export default function Sidebar({ isCollapsed = false }) {
    return (
        <aside className={`admin-sidebar${isCollapsed ? ' is-collapsed' : ''}`}>
            <div className="admin-sidebar-brand">
                <img src={brandLogo} alt="Bike360 logo" className="admin-sidebar-logo" />
                <div className="admin-sidebar-brand-copy">
                    <h2>Bike 360</h2>
                    <p>Operations</p>
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
        </aside>
    );
}
