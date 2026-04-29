import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import logo from '../../assets/4.png';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // For Milestone 1, just redirect straight to the Admin panel!
        navigate('/admin');
    };

    return (
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
                        <input type="email" placeholder="you@bike360.com" className="auth-input" required />
                    </label>
                    <label className="auth-field">
                        <span>Password</span>
                        <input type="password" placeholder="Enter your password" className="auth-input" required />
                    </label>

                    <button type="submit" className="auth-btn-primary">Sign In</button>
                </form>

                <div className="divider">OR</div>

                <button className="auth-btn-google">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="18" />
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
    );
}
