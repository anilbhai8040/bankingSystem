import React from 'react';
import { FaLandmark, FaShieldAlt, FaLock, FaGlobe } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <div className="logo-icon"><FaLandmark /></div>
            <div className="logo-text">NOVA CREST <span className="highlight">BANK</span></div>
          </div>
          <p className="footer-desc">
            Next-generation digital banking powered by military-grade encryption and real-time transaction processing.
          </p>
          <div className="security-badges">
            <span className="sec-badge"><FaShieldAlt /> 256-bit SSL</span>
            <span className="sec-badge"><FaLock /> RBI Compliant</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Banking Services</h4>
          <ul>
            <li><a href="/create-account">Savings Account</a></li>
            <li><a href="/fd">Fixed Deposits (7.5% p.a.)</a></li>
            <li><a href="/gold-loan">Gold Loans (8.5% p.a.)</a></li>
            <li><a href="/virtual-card">Virtual Debit & Credit Cards</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/deposit">Instant Deposit</a></li>
            <li><a href="/withdraw">Withdraw Funds</a></li>
            <li><a href="/statements">Account Statements</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Security & Support</h4>
          <ul>
            <li>24/7 Helpline: 1800-NOVA-CREST</li>
            <li>Support Email: care@novacrestbank.com</li>
            <li>Headquarters: Cyber City, Tower 9</li>
            <li><span className="system-status"><span className="status-dot"></span> Systems Normal</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Nova Crest Bank MERN Edition. All Rights Reserved. Empowered with MongoDB, Express, React & Node.js.</p>
      </div>
    </footer>
  );
};

export default Footer;
