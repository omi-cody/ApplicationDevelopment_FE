import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaTools, FaChartBar, FaCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Sidebar() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                {/* Replace with your actual logo image tag later */}
                <h2>⚙️ BIKE 360</h2>
                <p style={{ marginTop: '5px', fontSize: '14px' }}>Admin Panel</p>
            </div>

            <nav style={{ marginTop: '20px' }}>
                {/* Dashboard (No Dropdown) */}
                <button className="menu-btn" onClick={() => navigate('/admin')}>
                    <div className="menu-left"><FaHome /> Dashboard</div>
                </button>

                {/* Staff Management */}
                <button className="menu-btn" onClick={() => toggleDropdown('staff')}>
                    <div className="menu-left"><FaUsers /> Staff Management</div>
                    {openDropdown === 'staff' ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
                {openDropdown === 'staff' && (
                    <div className="sub-menu">
                        <NavLink to="/admin/staff/directory" className="sub-menu-link">Staff Directory</NavLink>
                        <NavLink to="/admin/staff/register" className="sub-menu-link">Register New Staff</NavLink>
                    </div>
                )}

                {/* Inventory & Parts */}
                <button className="menu-btn" onClick={() => toggleDropdown('inventory')}>
                    <div className="menu-left"><FaTools /> Inventory & Parts</div>
                    {openDropdown === 'inventory' ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
                {openDropdown === 'inventory' && (
                    <div className="sub-menu">
                        <NavLink to="/admin/inventory/parts" className="sub-menu-link">Vehicle Parts</NavLink>
                        <NavLink to="/admin/inventory/vendors" className="sub-menu-link">Vendors</NavLink>
                        <NavLink to="/admin/inventory/purchases" className="sub-menu-link">Purchase Invoices</NavLink>
                    </div>
                )}

                {/* Financial Reports */}
                <button className="menu-btn" onClick={() => toggleDropdown('reports')}>
                    <div className="menu-left"><FaChartBar /> Financial Reports</div>
                    {openDropdown === 'reports' ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
                {openDropdown === 'reports' && (
                    <div className="sub-menu">
                        <NavLink to="/admin/reports/daily" className="sub-menu-link">Daily Revenue</NavLink>
                        <NavLink to="/admin/reports/monthly" className="sub-menu-link">Monthly Revenue</NavLink>
                        <NavLink to="/admin/reports/yearly" className="sub-menu-link">Yearly Revenue</NavLink>
                    </div>
                )}

                {/* Settings */}
                <button className="menu-btn" onClick={() => toggleDropdown('settings')}>
                    <div className="menu-left"><FaCog /> Settings</div>
                    {openDropdown === 'settings' ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
                {openDropdown === 'settings' && (
                    <div className="sub-menu">
                        <NavLink to="/admin/settings/profile" className="sub-menu-link">My Profile</NavLink>
                        <NavLink to="/login" className="sub-menu-link">Logout</NavLink>
                    </div>
                )}
            </nav>
        </div>
    );
}