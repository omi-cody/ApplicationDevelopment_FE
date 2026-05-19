import { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiSearch, FiUserPlus } from 'react-icons/fi';
import './Admin.css';
import StaffForm from './StaffForm';
import { api } from '../../lib/api';

function mapStaff(staff) {
    return {
        id: staff.staffProfileId,
        userId: staff.userId,
        name: staff.fullName,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        department: staff.department,
        hireDate: staff.hireDate,
        role: staff.role,
        status: staff.isActive ? 'Active' : 'Inactive',
    };
}

export default function StaffManagement() {
    const [staffList, setStaffList] = useState([]);
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStaffId, setEditingStaffId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState('');
    const [formError, setFormError] = useState('');

    const editingStaff = useMemo(() => staffList.find((item) => item.id === editingStaffId) || null, [staffList, editingStaffId]);

    async function loadStaff() {
        setPageError('');
        setLoading(true);
        try {
            const data = await api.getStaff();
            setStaffList(data.map(mapStaff));
        } catch (err) {
            setPageError(err.message || 'Unable to load staff list.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStaff();
    }, []);

    const stats = useMemo(() => {
        const total = staffList.length;
        const active = staffList.filter((item) => item.status === 'Active').length;
        return { total, active, inactive: total - active };
    }, [staffList]);

    const filteredStaff = useMemo(() => {
        const q = query.trim().toLowerCase();
        return staffList.filter((item) => {
            const matchesQuery =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.email.toLowerCase().includes(q) ||
                String(item.userId).toLowerCase().includes(q);
            const matchesRole = roleFilter === 'All' || item.role === roleFilter;
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [query, roleFilter, staffList, statusFilter]);

    function openCreateForm() {
        setEditingStaffId(null);
        setFormError('');
        setIsFormOpen(true);
    }

    function openEditForm(staffId) {
        setEditingStaffId(staffId);
        setFormError('');
        setIsFormOpen(true);
    }

    function closeForm() {
        setIsFormOpen(false);
        setEditingStaffId(null);
        setFormError('');
    }

    async function handleSave(staffPayload) {
        setSaving(true);
        setFormError('');
        try {
            if (editingStaffId) {
                await api.updateStaff(editingStaffId, {
                    fullName: staffPayload.name,
                    email: staffPayload.email,
                    phoneNumber: staffPayload.phoneNumber,
                    department: staffPayload.department,
                    isActive: staffPayload.status === 'Active',
                    role: staffPayload.role,
                });
            } else {
                await api.createStaff({
                    fullName: staffPayload.name,
                    email: staffPayload.email,
                    phoneNumber: staffPayload.phoneNumber,
                    password: staffPayload.password,
                    department: staffPayload.department,
                    hireDate: staffPayload.hireDate,
                    role: staffPayload.role,
                });
            }
            await loadStaff();
            closeForm();
        } catch (err) {
            setFormError(err.message || 'Unable to save staff changes.');
        } finally {
            setSaving(false);
        }
    }

    async function toggleAccess(staff) {
        setPageError('');
        try {
            await api.updateStaff(staff.id, {
                fullName: staff.name,
                email: staff.email,
                phoneNumber: staff.phoneNumber,
                department: staff.department,
                isActive: staff.status !== 'Active',
                role: staff.role,
            });
            await loadStaff();
        } catch (err) {
            setPageError(err.message || 'Unable to update staff status.');
        }
    }

    function getInitials(name) {
        const cleaned = String(name || '').trim();
        if (!cleaned) return 'NA';
        const parts = cleaned.split(/\s+/).filter(Boolean);
        return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Staff Management</h1>
                    <p className="admin-page-subtitle">Manage employee roles and system access.</p>
                </div>
                <div className="admin-header-actions">
                    <button type="button" className="btn-primary admin-staff-cta" onClick={openCreateForm}>
                        <span className="btn-icon"><FiUserPlus size={16} /></span>
                        Register Staff
                    </button>
                </div>
            </div>

            {pageError ? <div className="admin-page-alert admin-page-alert-error">{pageError}</div> : null}

            <div className="admin-card">
                <div className="admin-toolbar">
                    <div className="admin-table-controls">
                        <div className="admin-mini-search" aria-label="Search staff">
                            <FiSearch size={15} />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search staff by name, email, or user ID" />
                        </div>
                    </div>

                    <div className="admin-chip-row" role="tablist" aria-label="Filters">
                        <button type="button" className={`admin-chip${roleFilter === 'All' ? ' is-active' : ''}`} onClick={() => setRoleFilter('All')}>All roles</button>
                        <button type="button" className={`admin-chip${roleFilter === 'Admin' ? ' is-active' : ''}`} onClick={() => setRoleFilter('Admin')}>Admin</button>
                        <button type="button" className={`admin-chip${roleFilter === 'Staff' ? ' is-active' : ''}`} onClick={() => setRoleFilter('Staff')}>Staff</button>

                        <span className="admin-chip-sep" aria-hidden="true" />

                        <button type="button" className={`admin-chip${statusFilter === 'All' ? ' is-active' : ''}`} onClick={() => setStatusFilter('All')}>All status</button>
                        <button type="button" className={`admin-chip${statusFilter === 'Active' ? ' is-active' : ''}`} onClick={() => setStatusFilter('Active')}>Active</button>
                        <button type="button" className={`admin-chip${statusFilter === 'Inactive' ? ' is-active' : ''}`} onClick={() => setStatusFilter('Inactive')}>Inactive</button>
                    </div>

                    <div className="admin-stats-inline" aria-label="Staff stats">
                        <span className="admin-stat-pill">Total <strong>{stats.total}</strong></span>
                        <span className="admin-stat-pill admin-stat-pill-active">Active <strong>{stats.active}</strong></span>
                        <span className="admin-stat-pill">Inactive <strong>{stats.inactive}</strong></span>
                    </div>
                </div>

                <div className="admin-list" role="list">
                    {loading ? (
                        <div className="admin-empty-state">Loading staff...</div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="admin-empty-state">No staff matches your filters.</div>
                    ) : (
                        filteredStaff.map((staff) => (
                            <div key={staff.id} className="admin-list-item" role="listitem">
                                <div className="admin-list-leading">
                                    <span className="admin-avatar" aria-hidden="true">{getInitials(staff.name)}</span>
                                </div>
                                <div className="admin-list-main">
                                    <div className="admin-list-title-row"><span className="admin-list-title">{staff.name}</span></div>
                                    <div className="admin-list-subtitle">{staff.email}</div>
                                </div>
                                <div className="admin-list-index" aria-label={`User ID ${staff.userId}`}>#{staff.userId.slice(0, 8)}</div>
                                <div className="admin-list-meta">
                                    <span className="admin-meta-role">
                                        <span className={`badge ${staff.role === 'Admin' ? 'badge-orange' : 'badge-blue'}`}>{staff.role}</span>
                                    </span>
                                    <span className="admin-meta-status">
                                        <span className={`status-dot ${staff.status === 'Active' ? 'status-active' : 'status-inactive'}`}>{staff.status}</span>
                                    </span>
                                </div>
                                <div className="admin-list-actions">
                                    <button type="button" className="btn-link" onClick={() => openEditForm(staff.id)}><FiEdit2 size={14} /> Edit</button>
                                    <button type="button" className={`btn-link${staff.status === 'Active' ? ' btn-link-danger' : ''}`} onClick={() => toggleAccess(staff)}>
                                        {staff.status === 'Active' ? 'Revoke Access' : 'Restore Access'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isFormOpen ? (
                <div className="admin-modal-overlay" role="presentation" onClick={closeForm}>
                    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={editingStaff ? 'Edit Staff' : 'Register New Staff'} onClick={(event) => event.stopPropagation()}>
                        <div className="admin-modal-head">
                            <div>
                                <h2 className="admin-card-title">{editingStaff ? 'Edit Staff' : 'Register New Staff'}</h2>
                                <p className="admin-form-subtitle">Changes are persisted in backend database.</p>
                            </div>
                            <button type="button" className="admin-modal-close-btn" onClick={closeForm}>Close</button>
                        </div>

                        <StaffForm
                            compact
                            formError={formError}
                            initialStaff={editingStaff}
                            submitLabel={saving ? 'Saving...' : editingStaff ? 'Save Changes' : 'Create Staff'}
                            onSave={handleSave}
                            onCancel={closeForm}
                            isCreating={!editingStaff}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
