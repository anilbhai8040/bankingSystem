import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaBolt, FaCoins, FaCreditCard, FaChartLine, FaCheckCircle, FaLock, FaUserPlus, FaArrowRight } from 'react-icons/fa';
import ThreeDBackground from '../components/ThreeDBackground';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* 3D Interactive Canvas Background */}
      <ThreeDBackground />

      {/* Hero Section */}
      <section className="hero-section glass-card hero-3d-card">
        <div className="hero-content">
          <span className="badge badge-purple mb-3 animated-pulse">
            <FaShieldAlt /> Military-Grade 3D Banking Core
          </span>
          <h1 className="hero-title">
            The Next Dimension of <br />
            <span className="gradient-text">Nova Crest Digital Banking</span>
          </h1>
          <p className="hero-subtitle">
            Experience ultra-secure digital accounts, instant transfers, smart fixed deposits (7.5% p.a.), gold loans, and virtual cards with zero friction. Minimum ₹500 opening deposit.
          </p>
          <div className="hero-btns">
            <Link to="/create-account" className="btn-primary btn-hero">
              <FaUserPlus /> Open Savings Account (Min ₹500)
            </Link>
            <Link to="/dashboard" className="btn-secondary btn-hero">
              Explore Dashboard <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="hero-widget">
          <div className="card-preview 3d-float">
            <div className="card-chip"></div>
            <div className="card-number">4532 •••• •••• 9012</div>
            <div className="card-footer">
              <div>
                <span className="card-label">CARD HOLDER</span>
                <span className="card-val">ALEX MORGAN</span>
              </div>
              <div>
                <span className="card-label">EXPIRES</span>
                <span className="card-val">12/29</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Highlights Bar */}
      <section className="rate-ticker glass-card">
        <div className="ticker-item">
          <span className="ticker-label">Opening Deposit</span>
          <span className="ticker-val text-emerald">Min ₹500</span>
        </div>
        <div className="ticker-divider"></div>
        <div className="ticker-item">
          <span className="ticker-label">Fixed Deposit (FD)</span>
          <span className="ticker-val text-cyan">7.5% p.a.</span>
        </div>
        <div className="ticker-divider"></div>
        <div className="ticker-item">
          <span className="ticker-label">Gold Loan Rate</span>
          <span className="ticker-val text-purple">8.5% p.a.</span>
        </div>
        <div className="ticker-divider"></div>
        <div className="ticker-item">
          <span className="ticker-label">Virtual Debit Card</span>
          <span className="ticker-val text-emerald">Free & Instant</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="features-section">
        <h2 className="section-heading text-center">Comprehensive Financial Platform</h2>
        <div className="features-grid">
          <div className="feature-card glass-card feature-3d">
            <div className="feature-icon icon-cyan"><FaBolt /></div>
            <h3>Instant Ledger Transfers</h3>
            <p>Deposit, withdraw, and transfer funds across accounts with instant ledger updates and automated transaction receipts.</p>
          </div>

          <div className="feature-card glass-card feature-3d">
            <div className="feature-icon icon-emerald"><FaChartLine /></div>
            <h3>Fixed Deposits (FD)</h3>
            <p>Grow your savings with guaranteed returns up to 7.5% per annum. Real-time maturity calculator and instant creation.</p>
          </div>

          <div className="feature-card glass-card feature-3d">
            <div className="feature-icon icon-gold"><FaCoins /></div>
            <h3>Instant Gold Loans</h3>
            <p>Hassle-free gold loans at 8.5% interest rate. Instant locker registration, disbursal, and easy repayments.</p>
          </div>

          <div className="feature-card glass-card feature-3d">
            <div className="feature-icon icon-purple"><FaCreditCard /></div>
            <h3>Smart Virtual Cards</h3>
            <p>Generate instant virtual debit and credit cards. Interactive 3D card flip, PIN change, and block/unlock controls.</p>
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <section className="stats-banner glass-card">
        <div className="stat-item">
          <h3 className="stat-num gradient-text">₹ 1.73 Lakh+</h3>
          <p className="stat-label">Total Balances Managed</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-num gradient-text">99.99%</h3>
          <p className="stat-label">Uptime & Availability</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-num gradient-text">&lt; 1 sec</h3>
          <p className="stat-label">Transaction Settlement</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-num gradient-text">256-Bit</h3>
          <p className="stat-label">End-to-End Encryption</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
