import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/4.png';
import './Auth.css';
import { registerCustomer } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
    const navigate        = useNavigate();
    const { saveSession } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail]       = useState('');
    const [phone, setPhone]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !phone || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await registerCustomer({ fullName, email, phone, password });

            saveSession(response);

            toast.success('Account created successfully! Welcome to Bike360.');

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1200);

        } catch (err) {
            toast.error(err.message ?? 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />

            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-glow auth-glow-top"></div>
                    <div className="auth-glow auth-glow-bottom"></div>
                    <div className="auth-grid-lines"></div>

                    <div className="auth-left-shell">
                        <div className="auth-story">
                            <p className="auth-story-kicker">MODERN PARTS WORKFLOW</p>
                            <h2>Launch a cleaner, faster way to manage bike inventory.</h2>
                            <p className="auth-story-copy">
                                Build your BIKE 360 workspace for sales, purchasing, stock control, and staff coordination
                                with a setup designed for real commerce teams.
                            </p>
                            <div className="auth-story-chips">
                                <span>Fast onboarding</span>
                                <span>Smart approvals</span>
                                <span>Multi-role teams</span>
                            </div>
                            <div className="auth-proof">
                                <div className="auth-proof-row">
                                    <span>Catalog Setup</span>
                                    <strong>Organize products, categories, and vendor data without clutter</strong>
                                </div>
                                <div className="auth-proof-row">
                                    <span>Approval Flow</span>
                                    <strong>Move purchasing and stock decisions through a cleaner workflow</strong>
                                </div>
                                <div className="auth-proof-row">
                                    <span>Business Roles</span>
                                    <strong>Create one workspace for ownership, inventory, and sales operations</strong>
                                </div>
                            </div>
                        </div>

                        <aside className="auth-aside" aria-label="Workspace setup highlights">
                            <div className="auth-aside-line"></div>
                            <div className="auth-aside-block">
                                <span>Setup Time</span>
                                <strong>Minutes</strong>
                                <p>Stand up a cleaner workflow for catalog, suppliers, and staff access.</p>
                            </div>
                            <div className="auth-aside-block">
                                <span>Team Ready</span>
                                <strong>Multi-role</strong>
                                <p>One workspace for owners, inventory operators, and sales coordination.</p>
                            </div>
                            <div className="auth-aside-note">
                                Designed to feel organized from day one, without extra noise or interface clutter.
                            </div>
                        </aside>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-panel-brand">
                        <img src={logo} alt="Bike 360 logo" />
                        <div>
                            <p>BIKE 360</p>
                            <span>Bike Parts Marketplace</span>
                        </div>
                    </div>

                    <p className="auth-subtitle">LET'S GET STARTED</p>
                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-panel-copy">
                        Set up your commerce workspace and start managing products, people, and purchasing with clarity.
                    </p>

                    <form className="auth-form" onSubmit={handleSignup}>
                        <label className="auth-field">
                            <span>Full Name</span>
                            <input
                                type="text"
                                placeholder="Your full name"
                                className="auth-input"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </label>
                        <label className="auth-field">
                            <span>Work Email</span>
                            <input
                                type="email"
                                placeholder="you@bike360.com"
                                className="auth-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </label>
                        <label className="auth-field">
                            <span>Phone Number</span>
                            <input
                                type="tel"
                                placeholder="+977 987654321"
                                className="auth-input"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </label>
                        <label className="auth-field">
                            <span>Password</span>
                            <input
                                type="password"
                                placeholder="Create a secure password"
                                className="auth-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </label>

                        <button
                            type="submit"
                            className="auth-btn-primary"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer-links auth-footer-center">
                        <span>
                            Already have an account? <Link to="/login">Log in</Link>
                        </span>
                    </div>

                    <div className="auth-panel-trust">
                        <span><FaCheckCircle /> Secure account creation for business teams</span>
                    </div>
                </div>
            </div>
        </>
    );
}