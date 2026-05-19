import { useEffect, useState } from 'react';
import './Admin.css';
import { api } from '../../lib/api';
import { getAuthUser } from '../../lib/auth';

export default function AdminProfile() {
    const [profile, setProfile] = useState(getAuthUser());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            setError('');
            try {
                const me = await api.me();
                setProfile({
                    userId: me.userId,
                    fullName: me.fullName,
                    email: me.email,
                    role: me.role,
                    expiresAtUtc: getAuthUser().expiresAtUtc,
                });
            } catch (err) {
                setError(err.message || 'Unable to load profile.');
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-page-title">Admin Profile</h1>
                    <p className="admin-page-subtitle">Signed-in account details and role access summary.</p>
                </div>
            </div>

            {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}

            <div className="admin-card">
                <div className="admin-card-title">Account Information</div>
                {loading ? (
                    <p>Loading profile...</p>
                ) : (
                    <div className="admin-form-grid">
                        <div className="admin-field">
                            <label>Full Name</label>
                            <input className="admin-input" value={profile.fullName || ''} disabled />
                        </div>
                        <div className="admin-field">
                            <label>Email</label>
                            <input className="admin-input" value={profile.email || ''} disabled />
                        </div>
                        <div className="admin-field">
                            <label>Role</label>
                            <input className="admin-input" value={profile.role || ''} disabled />
                        </div>
                        <div className="admin-field">
                            <label>User ID</label>
                            <input className="admin-input" value={profile.userId || ''} disabled />
                        </div>
                        <div className="admin-field">
                            <label>Token Expires (UTC)</label>
                            <input className="admin-input" value={profile.expiresAtUtc || 'Unknown'} disabled />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
