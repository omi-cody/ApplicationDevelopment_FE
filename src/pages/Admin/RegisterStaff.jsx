import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import StaffForm from './StaffForm';
import { api } from '../../lib/api';

export default function RegisterStaff() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleSave(newStaff) {
        setFormError('');
        setSaving(true);
        try {
            await api.createStaff({
                fullName: newStaff.name,
                email: newStaff.email,
                phoneNumber: newStaff.phoneNumber,
                password: newStaff.password,
                department: newStaff.department,
                hireDate: newStaff.hireDate,
                role: newStaff.role,
            });
            navigate('/admin/staff/directory');
        } catch (err) {
            setFormError(err.message || 'Unable to create staff.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Register New Staff</h1>
                    <p className="admin-page-subtitle">Create staff profiles directly in backend database.</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Staff Details</div>
                <StaffForm
                    compact
                    formError={formError}
                    isCreating
                    submitLabel={saving ? 'Creating...' : 'Create Staff'}
                    onSave={handleSave}
                    onCancel={() => navigate('/admin/staff/directory')}
                />
            </div>
        </div>
    );
}
