import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/4.png';
import './Auth.css';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const navigate        = useNavigate();
    const { saveSession } = useAuth();

    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser({ email, password });

            // response.roles = ["Admin"] — saveSession handles the array
            saveSession(response);

            // Pick role for redirect — roles is an array
            const primaryRole = Array.isArray(response.roles) && response.roles.length > 0
                ? response.roles[0].toLowerCase()
                : 'customer';

            toast.success(`Welcome back, ${response.fullName}!`);

            setTimeout(() => {
                if (primaryRole === 'admin' || primaryRole === 'staff') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }, 1000);

        } catch (err) {
            toast.error(err.message ?? 'Login failed. Please try again.');
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
                            <p className="auth-story-kicker">BIKE COMMERCE OS</p>
                            <h2>Run a sharper parts operation from one premium workflow.</h2>
                            <p className="auth-story-copy">
                                Track inventory movement, approve purchasing, and keep your shop ready for every repair,
                                upgrade, and retail order without the usual admin drag.
                            </p>
                            <div className="auth-story-chips">
                                <span>Live stock visibility</span>
                                <span>Vendor coordination</span>
                                <span>Role-based access</span>
                            </div>
                            <div className="auth-proof">
                                <div className="auth-proof-row">
                                    <span>Inventory Visibility</span>
                                    <strong>Real-time stock tracking across fast-moving parts</strong>
                                </div>
                                <div className="auth-proof-row">
                                    <span>Vendor Workflow</span>
                                    <strong>Purchase approvals and supplier coordination in one place</strong>
                                </div>
                                <div className="auth-proof-row">
                                    <span>Team Access</span>
                                    <strong>Structured permissions for owners, sales staff, and inventory teams</strong>
                                </div>
                            </div>
                        </div>

                        <aside className="auth-aside" aria-label="Commerce highlights">
                            <div className="auth-aside-line"></div>
                            <div className="auth-aside-block">
                                <span>Stock Accuracy</span>
                                <strong>98.2%</strong>
                                <p>Visibility across active inventory movement and reorder timing.</p>
                            </div>
                            <div className="auth-aside-block">
                                <span>Approval Speed</span>
                                <strong>3.4x</strong>
                                <p>Faster purchasing coordination for vendors, teams, and locations.</p>
                            </div>
                            <div className="auth-aside-note">
                                Built for parts-heavy commerce teams that need precision without operational clutter.
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

                    <p className="auth-subtitle">WELCOME BACK</p>
                    <h1 className="auth-title">Log in to your workspace</h1>
                    <p className="auth-panel-copy">
                        Access inventory, suppliers, and storefront operations from your secure dashboard.
                    </p>

                    <form className="auth-form" onSubmit={handleLogin}>
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
                            <span>Password</span>
                            <input
                                type="password"
                                placeholder="Enter your password"
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <button className="auth-btn-google">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                            alt="Google"
                            width="18"
                        />
                        Sign in with Google
                    </button>

                    <div className="auth-footer-links">
                        <Link to="#">Forgot Password?</Link>
                        <Link to="/signup">New to BIKE 360? Sign up</Link>
                    </div>

                    <div className="auth-panel-trust">
                        <span><FaCheckCircle /> Protected workspace access</span>
                    </div>
                </div>
            </div>
        </>
    );
}