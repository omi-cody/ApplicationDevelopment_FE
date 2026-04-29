import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBoxOpen, FaMotorcycle, FaShieldAlt, FaShippingFast, FaTools } from 'react-icons/fa';
import logo from '../../assets/4.png';
import heroImage from '../../assets/hero.png';
import './Home.css';

export default function Home() {
    return (
        <div className="home-page">
            <header className="home-header">
                <Link to="/" className="home-brand">
                    <img src={logo} alt="Bike 360 logo" className="home-brand-logo" />
                    <div>
                        <p className="home-brand-name">BIKE 360</p>
                        <p className="home-brand-tag">Bike Parts Marketplace</p>
                    </div>
                </Link>

                <nav className="home-nav">
                    <Link to="/login" className="home-link">Log In</Link>
                    <Link to="/signup" className="home-btn home-btn-outline">Create Account</Link>
                </nav>
            </header>

            <main className="home-main">
                <section className="home-hero">
                    <div className="home-hero-content">
                        <p className="home-kicker">INVENTORY. SALES. PERFORMANCE.</p>
                        <h1>Power your bike shop with the right parts, right now.</h1>
                        <p>
                            BIKE 360 helps garages and retailers source quality bike components, track stock in real time,
                            and manage purchase workflows from one place.
                        </p>

                        <div className="home-actions">
                            <Link to="/signup" className="home-btn home-btn-primary">
                                Start Free
                                <FaArrowRight />
                            </Link>
                            <Link to="/login" className="home-btn home-btn-ghost">I already have an account</Link>
                        </div>

                        <div className="home-metrics">
                            <div><strong>5K+</strong><span>Active Parts</span></div>
                            <div><strong>120+</strong><span>Vendor Partners</span></div>
                            <div><strong>24/7</strong><span>Inventory Visibility</span></div>
                        </div>
                    </div>

                    <div className="home-hero-media">
                        <div className="home-image-wrap">
                            <img src={heroImage} alt="Bike parts and tools display" />
                        </div>
                        <div className="home-floating-card">
                            <FaBoxOpen />
                            <div>
                                <p>Low Stock Alert</p>
                                <span>Brake Pads - 8 left</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-features">
                    <article>
                        <FaTools />
                        <h3>Parts Catalog</h3>
                        <p>Organize and search SKUs by brand, model, and category in seconds.</p>
                    </article>
                    <article>
                        <FaShippingFast />
                        <h3>Vendor Sync</h3>
                        <p>Track purchase orders and delivery status across all your suppliers.</p>
                    </article>
                    <article>
                        <FaShieldAlt />
                        <h3>Secure Access</h3>
                        <p>Role-based admin tools for staff, inventory managers, and owners.</p>
                    </article>
                    <article>
                        <FaMotorcycle />
                        <h3>Built for Workshops</h3>
                        <p>Designed for bike shops, service centers, and high-volume part sellers.</p>
                    </article>
                </section>
            </main>
        </div>
    );
}
