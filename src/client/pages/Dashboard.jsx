import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  FaWallet, FaExchangeAlt, FaPiggyBank, FaCoins, FaCreditCard, 
  FaHistory, FaUserPlus, FaTrashAlt, FaSearch, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { activeAccount, changeActiveAccount } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total_amount: 0,
    count_saving: 0,
    count_fd: 0,
    count_loan: 0,
    total_accounts: 0,
    primary_account: null,
    recent_transactions: [],
  });

  const [allAccounts, setAllAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, accountsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/overview'),
          axios.get('http://localhost:5000/api/account/all'),
        ]);

        if (overviewRes.data.success) {
          setStats(overviewRes.data);
        }

        if (accountsRes.data.accounts) {
          setAllAccounts(accountsRes.data.accounts);
          if (accountsRes.data.accounts.length > 0 && !activeAccount) {
            changeActiveAccount(accountsRes.data.accounts[0].accountNumber);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentAccountData = allAccounts.find(a => a.accountNumber === activeAccount) || stats.primary_account;

  return (
    <div className="dashboard-container">
      {/* Top Welcome Banner */}
      <div className="welcome-banner glass-card">
        <div className="welcome-text">
          <span className="badge badge-emerald mb-2">Account Active</span>
          <h1>Welcome to Nova Crest Digital Banking</h1>
          <p>Real-time financial dashboard with instant transaction tracking and account insights.</p>
        </div>
        
        {/* Account Selector Dropdown */}
        <div className="account-selector-card">
          <label>Select Active Account:</label>
          <select 
            value={activeAccount} 
            onChange={(e) => changeActiveAccount(e.target.value)}
            className="form-input account-select-dropdown"
          >
            {allAccounts.map(acc => (
              <option key={acc._id || acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} - {acc.fname} {acc.surname} (₹{acc.amount.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-header">
            <span className="metric-title">Available Total Balance</span>
            <div className="metric-icon icon-emerald"><FaWallet /></div>
          </div>
          <h2 className="metric-value">
            ₹ {Number(stats.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h2>
          <span className="metric-sub">Across all linked accounts</span>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <span className="metric-title">Savings Accounts</span>
            <div className="metric-icon icon-cyan"><FaUserPlus /></div>
          </div>
          <h2 className="metric-value">{stats.count_saving}</h2>
          <span className="metric-sub">Active Savings Accounts</span>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <span className="metric-title">Fixed Deposits (FD)</span>
            <div className="metric-icon icon-purple"><FaPiggyBank /></div>
          </div>
          <h2 className="metric-value">{stats.count_fd}</h2>
          <span className="metric-sub">Earning 7.5% per annum</span>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <span className="metric-title">Active Gold Loans</span>
            <div className="metric-icon icon-gold"><FaCoins /></div>
          </div>
          <h2 className="metric-value">{stats.count_loan}</h2>
          <span className="metric-sub">8.5% Interest Rate</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions & Services</h2>
        <div className="action-grid">
          <Link to="/create-account" className="action-card glass-card">
            <div className="action-icon"><FaUserPlus /></div>
            <h3>Open Account</h3>
            <p>New Savings & KYC</p>
          </Link>

          <Link to="/deposit" className="action-card glass-card">
            <div className="action-icon icon-emerald"><FaArrowDown /></div>
            <h3>Deposit Money</h3>
            <p>Instant Credit</p>
          </Link>

          <Link to="/withdraw" className="action-card glass-card">
            <div className="action-icon icon-rose"><FaArrowUp /></div>
            <h3>Withdraw Money</h3>
            <p>Instant Debit</p>
          </Link>

          <Link to="/statements" className="action-card glass-card">
            <div className="action-icon icon-cyan"><FaHistory /></div>
            <h3>Bank Statements</h3>
            <p>Audit & Filter Log</p>
          </Link>

          <Link to="/virtual-card" className="action-card glass-card">
            <div className="action-icon icon-purple"><FaCreditCard /></div>
            <h3>Virtual Card</h3>
            <p>3D Card & Security</p>
          </Link>

          <Link to="/fd" className="action-card glass-card">
            <div className="action-icon icon-gold"><FaPiggyBank /></div>
            <h3>Fixed Deposit</h3>
            <p>High Yield Interest</p>
          </Link>

          <Link to="/gold-loan" className="action-card glass-card">
            <div className="action-icon icon-gold"><FaCoins /></div>
            <h3>Gold Loan</h3>
            <p>Instant Approval</p>
          </Link>

          <Link to="/check-balance" className="action-card glass-card">
            <div className="action-icon"><FaSearch /></div>
            <h3>Check Balance</h3>
            <p>Quick Lookup</p>
          </Link>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="dashboard-section glass-card p-4">
        <div className="table-header-flex">
          <h2>Recent Activity Feed</h2>
          <Link to="/statements" className="btn-secondary btn-sm">View All Statements</Link>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Account</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_transactions.length > 0 ? (
                stats.recent_transactions.map((txn) => (
                  <tr key={txn._id || txn.transactionId}>
                    <td className="font-mono">{txn.transactionId}</td>
                    <td className="font-mono">{txn.accountNumber}</td>
                    <td>
                      <span className={`badge ${
                        txn.type === 'DEPOSIT' ? 'badge-emerald' : 
                        txn.type === 'WITHDRAWAL' ? 'badge-rose' : 'badge-purple'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td>{txn.date} {txn.time}</td>
                    <td className={`font-mono font-bold ${txn.type === 'DEPOSIT' ? 'text-emerald' : 'text-rose'}`}>
                      {txn.type === 'DEPOSIT' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                    </td>
                    <td><span className="badge badge-emerald">SUCCESS</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No recent transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
