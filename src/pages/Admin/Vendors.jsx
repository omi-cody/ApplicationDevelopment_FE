import { useEffect, useState } from 'react';
import './Admin.css';
import { api } from '../../lib/api';

const emptyVendor = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
};

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState(emptyVendor);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState('');
    const [formError, setFormError] = useState('');

    async function loadVendors() {
        setLoading(true);
        setPageError('');
        try {
            setVendors(await api.getVendors());
        } catch (err) {
            setPageError(err.message || 'Unable to load vendors.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadVendors();
    }, []);

    function openCreate() {
        setEditingId(null);
        setForm(emptyVendor);
        setFormError('');
        setShowForm(true);
    }

    function openEdit(vendor) {
        setEditingId(vendor.id);
        setForm({
            name: vendor.name,
            contactPerson: vendor.contactPerson,
            email: vendor.email,
            phone: vendor.phone,
            address: vendor.address,
        });
        setFormError('');
        setShowForm(true);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            if (editingId) {
                await api.updateVendor(editingId, form);
            } else {
                await api.createVendor(form);
            }
            setShowForm(false);
            setForm(emptyVendor);
            await loadVendors();
        } catch (err) {
            setFormError(err.message || 'Unable to save vendor.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this vendor?')) return;
        setPageError('');
        try {
            await api.deleteVendor(id);
            await loadVendors();
        } catch (err) {
            setPageError(err.message || 'Unable to delete vendor.');
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Vendor Management</h1>
                    <p className="admin-page-subtitle">Manage suppliers and wholesale distributors.</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>+ Add Vendor</button>
            </div>

            {pageError ? <div className="admin-page-alert admin-page-alert-error">{pageError}</div> : null}

            {showForm ? (
                <div className="admin-card" style={{ marginBottom: '16px' }}>
                    <div className="admin-card-title">{editingId ? 'Edit Vendor' : 'Create Vendor'}</div>
                    <form className="admin-form admin-form-compact" onSubmit={handleSubmit}>
                        {formError ? <div className="admin-form-error-banner">{formError}</div> : null}
                        <div className="admin-form-grid">
                            <div className="admin-field"><label>Name</label><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="admin-field"><label>Contact Person</label><input className="admin-input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} required /></div>
                            <div className="admin-field"><label>Email</label><input className="admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                            <div className="admin-field"><label>Phone</label><input className="admin-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
                            <div className="admin-field"><label>Address</label><input className="admin-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="btn-link" onClick={() => { setShowForm(false); setFormError(''); }}>Cancel</button>
                            <button type="submit" className="btn-primary">{saving ? 'Saving...' : editingId ? 'Update Vendor' : 'Create Vendor'}</button>
                        </div>
                    </form>
                </div>
            ) : null}

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Vendor ID</th>
                                <th>Company Name</th>
                                <th>Contact Person</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6}>Loading vendors...</td></tr>
                            ) : vendors.length === 0 ? (
                                <tr><td colSpan={6}>No vendors found.</td></tr>
                            ) : vendors.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td>{vendor.id.slice(0, 8)}</td>
                                    <td className="cell-strong">{vendor.name}</td>
                                    <td>{vendor.contactPerson}</td>
                                    <td>{vendor.phone}</td>
                                    <td>{vendor.email}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-link" onClick={() => openEdit(vendor)}>Edit</button>
                                            <button className="btn-link btn-link-danger" onClick={() => handleDelete(vendor.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
