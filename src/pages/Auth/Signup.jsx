import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import logo from '../../assets/logo-alt.png';
import signupVisual from '../../assets/SignUp.png';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div className="auth-container auth-signup-page">
            <div className="auth-left auth-left-signup">
                <img src={signupVisual} alt="" className="auth-signup-base-image" aria-hidden="true" />
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
                    Join BIKE 360 and start exploring parts, services, and tools made for everyday users and teams.
                </p>

                <form className="auth-form" onSubmit={handleSignup}>
                    <label className="auth-field">
                        <span>Full Name</span>
                        <input type="text" placeholder="Your full name" className="auth-input" required />
                    </label>
                    <label className="auth-field">
                        <span>Work Email</span>
                        <input type="email" placeholder="you@bike360.com" className="auth-input" required />
                    </label>
                    <label className="auth-field">
                        <span>Phone Number</span>
                        <input type="tel" placeholder="+977 987654321" className="auth-input" required />
                    </label>
                    <label className="auth-field">
                        <span>Password</span>
                        <input type="password" placeholder="Create a secure password" className="auth-input" required />
                    </label>

                    <button type="submit" className="auth-btn-primary">Create Account</button>
                </form>

                <div className="auth-footer-links auth-footer-center">
                    <span>
                        Already have an account? <Link to="/login">Log in</Link>
                    </span>
                </div>

                <div className="auth-panel-trust">
                    <span><FaCheckCircle /> Secure account creation for all BIKE 360 users</span>
                </div>
            </div>
        </div>
    );
}

