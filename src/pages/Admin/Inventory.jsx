import { useEffect, useState } from 'react';
import './Admin.css';
import { api } from '../../lib/api';

const emptyPart = {
    name: '',
    category: '',
    brand: '',
    partNumber: '',
    sellingPrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 10,
    description: '',
};

export default function Inventory() {
    const [parts, setParts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyPart);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState('');
    const [formError, setFormError] = useState('');

    async function loadParts() {
        setLoading(true);
        setPageError('');
        try {
            setParts(await api.getParts());
        } catch (err) {
            setPageError(err.message || 'Unable to load parts.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadParts();
    }, []);

    function openCreate() {
        setEditingId(null);
        setForm(emptyPart);
        setFormError('');
        setShowForm(true);
    }

    function openEdit(part) {
        setEditingId(part.id);
        setForm({
            name: part.name,
            category: part.category,
            brand: part.brand,
            partNumber: part.partNumber,
            sellingPrice: part.sellingPrice,
            costPrice: part.costPrice,
            stockQuantity: part.stockQuantity,
            lowStockThreshold: part.lowStockThreshold,
            description: part.description,
        });
        setFormError('');
        setShowForm(true);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setFormError('');
        try {
            const payload = {
                ...form,
                sellingPrice: Number(form.sellingPrice),
                costPrice: Number(form.costPrice),
                stockQuantity: Number(form.stockQuantity),
                lowStockThreshold: Number(form.lowStockThreshold),
            };

            if (editingId) {
                const { partNumber: _ignored, ...updatePayload } = payload;
                await api.updatePart(editingId, updatePayload);
            } else {
                await api.createPart(payload);
            }

            setShowForm(false);
            setForm(emptyPart);
            await loadParts();
        } catch (err) {
            setFormError(err.message || 'Unable to save part.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this part?')) return;
        setPageError('');
        try {
            await api.deletePart(id);
            await loadParts();
        } catch (err) {
            setPageError(err.message || 'Unable to delete part.');
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Vehicle Parts Inventory</h1>
                    <p className="admin-page-subtitle">Manage part records, pricing, and stock levels.</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>+ Add Part</button>
            </div>

            {pageError ? <div className="admin-page-alert admin-page-alert-error">{pageError}</div> : null}

            {showForm ? (
                <div className="admin-card" style={{ marginBottom: '16px' }}>
                    <div className="admin-card-title">{editingId ? 'Edit Part' : 'Create Part'}</div>
                    <form className="admin-form admin-form-compact" onSubmit={handleSubmit}>
                        {formError ? <div className="admin-form-error-banner">{formError}</div> : null}
                        <div className="admin-form-grid">
                            <div className="admin-field"><label>Name</label><input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="admin-field"><label>Category</label><input className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
                            <div className="admin-field"><label>Brand</label><input className="admin-input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required /></div>
                            <div className="admin-field"><label>Part Number</label><input className="admin-input" value={form.partNumber} onChange={(e) => setForm({ ...form, partNumber: e.target.value })} required disabled={Boolean(editingId)} /></div>
                            <div className="admin-field"><label>Selling Price</label><input className="admin-input" type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} required /></div>
                            <div className="admin-field"><label>Cost Price</label><input className="admin-input" type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required /></div>
                            <div className="admin-field"><label>Stock Quantity</label><input className="admin-input" type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required /></div>
                            <div className="admin-field"><label>Low Stock Threshold</label><input className="admin-input" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} required /></div>
                            <div className="admin-field"><label>Description</label><input className="admin-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="btn-link" onClick={() => { setShowForm(false); setFormError(''); }}>Cancel</button>
                            <button type="submit" className="btn-primary">{saving ? 'Saving...' : editingId ? 'Update Part' : 'Create Part'}</button>
                        </div>
                    </form>
                </div>
            ) : null}

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Part Number</th>
                                <th>Part Name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Stock</th>
                                <th>Unit Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7}>Loading parts...</td></tr>
                            ) : parts.length === 0 ? (
                                <tr><td colSpan={7}>No parts found.</td></tr>
                            ) : parts.map((part) => (
                                <tr key={part.id}>
                                    <td>{part.partNumber}</td>
                                    <td className="cell-strong">{part.name}</td>
                                    <td>{part.category}</td>
                                    <td>{part.brand}</td>
                                    <td>
                                        <span className={`badge ${part.stockQuantity < part.lowStockThreshold ? 'badge-red' : 'badge-green'}`}>
                                            {part.stockQuantity} Units
                                        </span>
                                    </td>
                                    <td>Rs. {Number(part.sellingPrice).toLocaleString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-link" onClick={() => openEdit(part)}>Edit</button>
                                            <button className="btn-link btn-link-danger" onClick={() => handleDelete(part.id)}>Delete</button>
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
