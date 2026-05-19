import { useEffect, useMemo, useState } from 'react';
import './Admin.css';

const EMPTY_STAFF = {
    name: '',
    email: '',
    phoneNumber: '',
    department: 'Service',
    role: 'Staff',
    status: 'Active',
    hireDate: new Date().toISOString().split('T')[0],
    password: '',
};

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeInput(value) {
    return String(value ?? '').trim();
}

export default function StaffForm({
    initialStaff,
    onSave,
    onCancel,
    submitLabel = 'Save Staff',
    compact = false,
    isCreating = false,
    formError = '',
}) {
    const initialValue = useMemo(() => {
        if (!initialStaff) return EMPTY_STAFF;
        return {
            name: normalizeInput(initialStaff.name),
            email: normalizeInput(initialStaff.email),
            phoneNumber: normalizeInput(initialStaff.phoneNumber),
            department: normalizeInput(initialStaff.department || 'Service'),
            role: initialStaff.role || 'Staff',
            status: initialStaff.status || 'Active',
            hireDate: initialStaff.hireDate || new Date().toISOString().split('T')[0],
            password: '',
        };
    }, [initialStaff]);

    const [form, setForm] = useState(initialValue);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(initialValue);
        setErrors({});
    }, [initialValue]);

    function validate(nextForm) {
        const nextErrors = {};

        if (!normalizeInput(nextForm.name)) nextErrors.name = 'Full name is required.';
        if (!normalizeInput(nextForm.email)) nextErrors.email = 'Email is required.';
        if (normalizeInput(nextForm.email) && !isValidEmail(nextForm.email)) nextErrors.email = 'Enter a valid email.';
        if (!normalizeInput(nextForm.phoneNumber)) nextErrors.phoneNumber = 'Phone number is required.';
        if (!normalizeInput(nextForm.department)) nextErrors.department = 'Department is required.';
        if (isCreating && !normalizeInput(nextForm.password)) nextErrors.password = 'Password is required for new staff.';

        return nextErrors;
    }

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;

        onSave({
            ...initialStaff,
            name: normalizeInput(form.name),
            email: normalizeInput(form.email).toLowerCase(),
            phoneNumber: normalizeInput(form.phoneNumber),
            department: normalizeInput(form.department),
            role: form.role,
            status: form.status,
            hireDate: form.hireDate,
            password: normalizeInput(form.password),
        });
    }

    return (
        <form className={`admin-form${compact ? ' admin-form-compact' : ''}`} onSubmit={handleSubmit}>
            {formError ? <div className="admin-form-error-banner">{formError}</div> : null}
            <div className="admin-form-grid">
                <div className="admin-field">
                    <label htmlFor="staff-name">Full Name</label>
                    <input
                        id="staff-name"
                        className={`admin-input${errors.name ? ' is-error' : ''}`}
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="e.g. Aaryan Jha"
                    />
                    {errors.name ? <div className="admin-field-error">{errors.name}</div> : null}
                </div>

                <div className="admin-field">
                    <label htmlFor="staff-email">Email</label>
                    <input
                        id="staff-email"
                        className={`admin-input${errors.email ? ' is-error' : ''}`}
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="name@company.com"
                    />
                    {errors.email ? <div className="admin-field-error">{errors.email}</div> : null}
                </div>

                <div className="admin-field">
                    <label htmlFor="staff-phone">Phone Number</label>
                    <input
                        id="staff-phone"
                        className={`admin-input${errors.phoneNumber ? ' is-error' : ''}`}
                        value={form.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        placeholder="9812345678"
                    />
                    {errors.phoneNumber ? <div className="admin-field-error">{errors.phoneNumber}</div> : null}
                </div>

                <div className="admin-field">
                    <label htmlFor="staff-department">Department</label>
                    <input
                        id="staff-department"
                        className={`admin-input${errors.department ? ' is-error' : ''}`}
                        value={form.department}
                        onChange={(e) => updateField('department', e.target.value)}
                        placeholder="Service"
                    />
                    {errors.department ? <div className="admin-field-error">{errors.department}</div> : null}
                </div>

                <div className="admin-field">
                    <label htmlFor="staff-role">Role</label>
                    <select id="staff-role" className="admin-select" value={form.role} onChange={(e) => updateField('role', e.target.value)}>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                    </select>
                </div>

                <div className="admin-field">
                    <label htmlFor="staff-status">Status</label>
                    <select id="staff-status" className="admin-select" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="admin-field">
                    <label htmlFor="staff-hire-date">Hire Date</label>
                    <input
                        id="staff-hire-date"
                        type="date"
                        className="admin-input"
                        value={form.hireDate}
                        onChange={(e) => updateField('hireDate', e.target.value)}
                    />
                </div>

                {isCreating ? (
                    <div className="admin-field">
                        <label htmlFor="staff-password">Temporary Password</label>
                        <input
                            id="staff-password"
                            type="password"
                            className={`admin-input${errors.password ? ' is-error' : ''}`}
                            value={form.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            placeholder="At least 8 chars"
                        />
                        {errors.password ? <div className="admin-field-error">{errors.password}</div> : null}
                    </div>
                ) : null}
            </div>

            <div className="admin-form-actions">
                <button type="button" className="btn-link" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
