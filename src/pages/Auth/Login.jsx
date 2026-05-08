import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import logo from '../../assets/logo-alt.png';
import loginVisual from '../../assets/LoginPic.png';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/admin');
    };

    return (
        <div className="auth-container auth-login-page">
            <div className="auth-left auth-left-login">
                <img src={loginVisual} alt="" className="auth-login-base-image" aria-hidden="true" />
                <div className="auth-login-overlay" aria-hidden="true" />
                <div className="auth-login-content">
                    <div className="auth-story-brand">
                        <img src={logo} alt="Bike 360 logo" />
                        <span>BIKE 360</span>
                    </div>
                    <p className="auth-story-kicker">RIDE. SHOP. SERVICE.</p>
                    <h2>Everything your bike needs, in one place.</h2>
                    <p className="auth-story-copy auth-one-liner">
                        Trusted parts, quick service, and a simple experience for every rider.
                    </p>
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
                <h1 className="auth-title">Log in to BIKE 360</h1>
                <p className="auth-panel-copy">
                    Continue where you left off and access your parts, bookings, and account activity.
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
                    <span><FaCheckCircle /> Secure sign-in for all BIKE 360 users</span>
                </div>
            </div>
        </div>
    );
}
