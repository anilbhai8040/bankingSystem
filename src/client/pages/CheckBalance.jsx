import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaWallet, FaUserCheck, FaShieldAlt } from 'react-icons/fa';
import './CheckBalance.css';

const CheckBalance = () => {
  const { activeAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '1002003001');
  const [balanceData, setBalanceData] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setBalanceData(null);
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:5000/api/account/balance/${accountNumber}`);
      setBalanceData(res.data);
    } catch (error) {
      const errText = error.response?.data?.message || 'Account not found. Please verify the account number.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="balance-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaWallet /> Check <span className="gradient-text">Account Balance</span></h1>
        <p className="page-subtitle">Instant real-time balance query and account status inspection.</p>
      </div>

      <div className="balance-grid">
        <div className="glass-card balance-form-card">
          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleCheckBalance} className="balance-form">
            <div className="form-group">
              <label>Savings Account Number *</label>
              <input 
                type="text"
                className="form-input font-mono text-lg"
                placeholder="Enter 10-digit Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Checking...' : <><FaSearch /> Inquiry Balance</>}
            </button>
          </form>
        </div>

        {balanceData && (
          <div className="glass-card balance-display-card">
            <div className="balance-display-header">
              <span className="badge badge-emerald"><FaUserCheck /> Verified Account</span>
              <span className="account-num font-mono">{balanceData.accountNumber}</span>
            </div>

            <div className="balance-main">
              <span className="balance-label">Current Available Balance</span>
              <h1 className="balance-amount font-mono text-emerald">
                ₹ {Number(balanceData.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h1>
              <p className="account-holder-name">{balanceData.name}</p>
            </div>

            <div className="balance-footer">
              <span className="sec-tag"><FaShieldAlt /> Real-Time MERN Ledger Sync</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckBalance;
