import { useState } from 'react';
import './Admin.css';
import { getDefaultServicePricing, getServicePricing, saveServicePricing } from '../../lib/servicePricing';

export default function ServicePricing() {
    const [pricing, setPricing] = useState(getServicePricing());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    function validate(nextPricing) {
        if (Number(nextPricing.halfService) < 500 || Number(nextPricing.halfService) > 1000) {
            return 'Half Service charge must be between Rs. 500 and Rs. 1000.';
        }

        if (Number(nextPricing.fullService) < 500 || Number(nextPricing.fullService) > 1000) {
            return 'Full Service charge must be between Rs. 500 and Rs. 1000.';
        }

        if (Number(nextPricing.fullService) < Number(nextPricing.halfService)) {
            return 'Full Service charge should not be lower than Half Service charge.';
        }

        return '';
    }

    function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        const validationMessage = validate(pricing);
        if (validationMessage) {
            setError(validationMessage);
            setSaving(false);
            return;
        }

        const saved = saveServicePricing(pricing);
        setPricing(saved);
        setMessage('Service pricing updated.');
        setSaving(false);
    }

    function resetDefaults() {
        const defaults = getDefaultServicePricing();
        setPricing(defaults);
        saveServicePricing(defaults);
        setError('');
        setMessage('Default pricing restored.');
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Service Pricing</h1>
                    <p className="admin-page-subtitle">Set the standard service charge used for half and full service bookings.</p>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-card-title">Base Charges</div>
                <p className="admin-form-subtitle">Allowed range: Rs. 500 to Rs. 1000.</p>
                <form className="admin-form admin-form-compact" onSubmit={handleSave}>
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Half Service</label>
                            <input
                                type="number"
                                min="500"
                                max="1000"
                                className="admin-input"
                                value={pricing.halfService}
                                onChange={(event) => setPricing((current) => ({ ...current, halfService: event.target.value }))}
                            />
                        </div>
                        <div className="admin-field">
                            <label>Full Service</label>
                            <input
                                type="number"
                                min="500"
                                max="1000"
                                className="admin-input"
                                value={pricing.fullService}
                                onChange={(event) => setPricing((current) => ({ ...current, fullService: event.target.value }))}
                            />
                        </div>
                    </div>

                    {error ? <div className="admin-form-error-banner">{error}</div> : null}
                    {message ? <div className="admin-form-success-banner">{message}</div> : null}

                    <div className="admin-form-actions">
                        <button type="button" className="btn-ghost" onClick={resetDefaults}>Reset</button>
                        <button type="submit" className="btn-primary">{saving ? 'Saving...' : 'Save Pricing'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
