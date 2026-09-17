import React from 'react';
import { FaLandmark, FaShieldAlt, FaAward, FaUsers, FaGlobe, FaChartLine } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title">About <span className="gradient-text">Nova Crest Bank</span></h1>
        <p className="page-subtitle">Pioneering the next era of digital banking with military-grade security and intelligent financial engineering.</p>
      </div>

      <div className="about-hero glass-card">
        <div className="hero-text-col">
          <span className="badge badge-purple mb-2">Our Mission & Vision</span>
          <h2>Empowering Millions with Next-Gen Digital Finance</h2>
          <p>
            Established with a vision to redefine financial freedom, Nova Crest Bank integrates high-performance MERN cloud infrastructure, real-time transaction processing, and automated ledger auditing.
          </p>
          <div className="stats-row">
            <div>
              <h3 className="gradient-text">₹1,000 Cr+</h3>
              <span>Processed Transactions</span>
            </div>
            <div>
              <h3 className="gradient-text">500,000+</h3>
              <span>Active Account Holders</span>
            </div>
            <div>
              <h3 className="gradient-text">99.99%</h3>
              <span>Core System Uptime</span>
            </div>
          </div>
        </div>
      </div>

      <div className="values-grid mt-4">
        <div className="glass-card value-card">
          <div className="value-icon icon-emerald"><FaShieldAlt /></div>
          <h3>256-Bit SSL Security</h3>
          <p>End-to-end encryption across all mobile, API, and web portals protecting customer privacy and asset security.</p>
        </div>

        <div className="glass-card value-card">
          <div className="value-icon icon-cyan"><FaChartLine /></div>
          <h3>High Interest Returns</h3>
          <p>Market-leading interest rates on Fixed Deposits (7.5% p.a.) and transparent, low-cost credit facilities.</p>
        </div>

        <div className="glass-card value-card">
          <div className="value-icon icon-purple"><FaGlobe /></div>
          <h3>Seamless Cloud Core</h3>
          <p>Zero-maintenance embedded database synchronization with instantaneous instant ledger settlements.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
