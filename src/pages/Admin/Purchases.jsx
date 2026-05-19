import { useEffect, useState } from 'react';
import './Admin.css';
import { api } from '../../lib/api';

export default function Purchases() {
    const [vendors, setVendors] = useState([]);
    const [parts, setParts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState('');
    const [formError, setFormError] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [form, setForm] = useState({
        invoiceNumber: `PI-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorId: '',
        status: 3,
        vehiclePartId: '',
        quantity: 1,
        unitCost: 0,
    });

    async function loadData() {
        setLoading(true);
        setPageError('');
        try {
            const [vendorsData, partsData, invoicesData] = await Promise.all([
                api.getVendors(),
                api.getParts(),
                api.getPurchaseInvoices(),
            ]);
            setVendors(vendorsData);
            setParts(partsData);
            setInvoices(invoicesData);

            if (!form.vendorId && vendorsData.length > 0) {
                setForm((prev) => ({ ...prev, vendorId: vendorsData[0].id }));
            }
            if (!form.vehiclePartId && partsData.length > 0) {
                setForm((prev) => ({
                    ...prev,
                    vehiclePartId: partsData[0].id,
                    unitCost: Number(partsData[0].costPrice || 0),
                }));
            }
        } catch (err) {
            setPageError(err.message || 'Unable to load purchase data.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleCreate(event) {
        event.preventDefault();
        setFormError('');
        setSaving(true);
        try {
            await api.createPurchaseInvoice({
                invoiceNumber: form.invoiceNumber,
                vendorId: form.vendorId,
                status: Number(form.status),
                items: [
                    {
                        vehiclePartId: form.vehiclePartId,
                        quantity: Number(form.quantity),
                        unitCost: Number(form.unitCost),
                    },
                ],
            });
            setForm((prev) => ({ ...prev, invoiceNumber: `PI-${Math.floor(1000 + Math.random() * 9000)}` }));
            await loadData();
        } catch (err) {
            setFormError(err.message || 'Unable to create purchase invoice.');
        } finally {
            setSaving(false);
        }
    }

    function onPartChange(partId) {
        const part = parts.find((p) => p.id === partId);
        setForm((prev) => ({
            ...prev,
            vehiclePartId: partId,
            unitCost: Number(part?.costPrice || 0),
        }));
    }

    function getStatusLabel(status) {
        if (status === 1) return 'Draft';
        if (status === 2) return 'Ordered';
        if (status === 3) return 'Received';
        if (status === 4) return 'Cancelled';
        return String(status);
    }

    function getVendorName(vendorId) {
        return vendors.find((item) => item.id === vendorId)?.name || vendorId?.slice(0, 8);
    }

    function getPartName(partId) {
        const part = parts.find((item) => item.id === partId);
        if (!part) return partId?.slice(0, 8);
        return `${part.partNumber} - ${part.name}`;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Purchase Invoices</h1>
                    <p className="admin-page-subtitle">Create purchase invoices and auto-restock inventory.</p>
                </div>
            </div>

            {pageError ? <div className="admin-page-alert admin-page-alert-error">{pageError}</div> : null}

            <div className="admin-card" style={{ marginBottom: '16px' }}>
                <div className="admin-card-title">Create Purchase Invoice</div>
                <form className="admin-form admin-form-compact" onSubmit={handleCreate}>
                    {formError ? <div className="admin-form-error-banner">{formError}</div> : null}
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Invoice Number</label>
                            <input className="admin-input" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} required />
                        </div>
                        <div className="admin-field">
                            <label>Vendor</label>
                            <select className="admin-select" value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })} required>
                                {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Part</label>
                            <select className="admin-select" value={form.vehiclePartId} onChange={(e) => onPartChange(e.target.value)} required>
                                {parts.map((part) => <option key={part.id} value={part.id}>{part.partNumber} - {part.name}</option>)}
                            </select>
                        </div>
                        <div className="admin-field">
                            <label>Quantity</label>
                            <input className="admin-input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                        </div>
                        <div className="admin-field">
                            <label>Unit Cost</label>
                            <input className="admin-input" type="number" min="0" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} required />
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button className="btn-primary" type="submit">{saving ? 'Creating...' : 'Create Purchase Invoice'}</button>
                    </div>
                </form>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Invoice Number</th>
                                <th>Vendor</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Items</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7}>Loading purchase invoices...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan={7}>No purchase invoices found.</td></tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="cell-strong">{invoice.invoiceNumber}</td>
                                    <td>{getVendorName(invoice.vendorId)}</td>
                                    <td>{new Date(invoice.purchaseDate).toLocaleDateString()}</td>
                                    <td>{getStatusLabel(invoice.status)}</td>
                                    <td>Rs. {Number(invoice.totalAmount).toLocaleString()}</td>
                                    <td>{invoice.items?.length || 0}</td>
                                    <td>
                                        <button className="btn-link" onClick={() => setSelectedInvoice(invoice)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedInvoice ? (
                <div className="admin-card" style={{ marginTop: '16px' }}>
                    <div className="admin-card-title">Invoice Detail: {selectedInvoice.invoiceNumber}</div>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span><strong>Vendor:</strong> {getVendorName(selectedInvoice.vendorId)}</span>
                        <span><strong>Status:</strong> {getStatusLabel(selectedInvoice.status)}</span>
                        <span><strong>Total:</strong> Rs. {Number(selectedInvoice.totalAmount).toLocaleString()}</span>
                    </div>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Part</th>
                                    <th>Quantity</th>
                                    <th>Unit Cost</th>
                                    <th>Line Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInvoice.items?.length ? selectedInvoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{getPartName(item.vehiclePartId)}</td>
                                        <td>{item.quantity}</td>
                                        <td>Rs. {Number(item.unitCost).toLocaleString()}</td>
                                        <td>Rs. {Number(item.lineTotal).toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4}>No items found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
