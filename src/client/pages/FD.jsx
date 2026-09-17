import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaPiggyBank, FaCalculator, FaCheckCircle, FaLock } from 'react-icons/fa';
import './FD.css';

const FD = () => {
  const { activeAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '1002003001');
  const [amount, setAmount] = useState(50000);
  const [timeYears, setTimeYears] = useState(3);
  const [email, setEmail] = useState('');
  
  const [fds, setFds] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Interest calculation (7.5% per annum)
  const interestRate = 7.5;
  const calculatedMaturity = Math.round(Number(amount || 0) * Math.pow(1 + interestRate / 100, Number(timeYears || 1)));

  const fetchFDs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/fd/list?account_number=${accountNumber}`);
      setFds(res.data.fds || []);
    } catch (error) {
      console.error('Error fetching FD accounts:', error);
    }
  };

  useEffect(() => {
    fetchFDs();
  }, [accountNumber]);

  const handleCreateFD = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/fd/create', {
        account_number: accountNumber,
        amount: Number(amount),
        time: Number(timeYears),
        email,
      });

      setMessage({ text: res.data.message, type: 'success' });
      fetchFDs();
    } catch (error) {
      const errText = error.response?.data?.message || 'Failed to create Fixed Deposit.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fd-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaPiggyBank /> Fixed Deposit <span className="gradient-text">(FD) Portal</span></h1>
        <p className="page-subtitle">Earn up to 7.5% p.a. guaranteed returns with automated maturity payout.</p>
      </div>

      <div className="fd-grid">
        {/* FD Application Form */}
        <div className="glass-card fd-form-card">
          <h3 className="section-subtitle">Open New Fixed Deposit</h3>

          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleCreateFD} className="fd-form">
            <div className="form-group">
              <label>Savings Account Number *</label>
              <input 
                type="text"
                className="form-input font-mono"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Deposit Amount (Min ₹5,000) *</label>
                <input 
                  type="number"
                  className="form-input font-mono"
                  min="5000"
                  max="10000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tenure Period (Years) *</label>
                <input 
                  type="number"
                  className="form-input font-mono"
                  min="1"
                  max="10"
                  value={timeYears}
                  onChange={(e) => setTimeYears(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notification Email *</label>
              <input 
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating FD...' : <><FaCheckCircle /> Open FD Account</>}
            </button>
          </form>
        </div>

        {/* Live Maturity Calculator Preview Widget */}
        <div className="glass-card calc-card">
          <div className="calc-header">
            <FaCalculator className="calc-icon" />
            <h3>FD Maturity Calculator</h3>
          </div>

          <div className="calc-body">
            <div className="calc-row">
              <span>Principal Amount:</span>
              <span className="font-mono">₹{Number(amount || 0).toLocaleString()}</span>
            </div>

            <div className="calc-row">
              <span>Interest Rate:</span>
              <span className="badge badge-emerald">7.5% p.a.</span>
            </div>

            <div className="calc-row">
              <span>Tenure:</span>
              <span className="font-mono">{timeYears} Year(s)</span>
            </div>

            <div className="calc-divider"></div>

            <div className="calc-result">
              <span>Guaranteed Maturity Value:</span>
              <h2 className="maturity-num gradient-text font-mono">
                ₹{calculatedMaturity.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Active FDs Table */}
      <div className="glass-card table-card mt-4">
        <h3 className="section-subtitle">Active Fixed Deposits for Acc: {accountNumber}</h3>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>FD Account No</th>
                <th>Principal Amount</th>
                <th>Tenure</th>
                <th>Interest Rate</th>
                <th>Maturity Amount</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fds.length > 0 ? (
                fds.map((fd) => (
                  <tr key={fd._id || fd.fdAccountNumber}>
                    <td className="font-mono">{fd.fdAccountNumber}</td>
                    <td className="font-mono font-bold">₹{fd.amount?.toLocaleString()}</td>
                    <td>{fd.timeInYears} Year(s)</td>
                    <td><span className="badge badge-emerald">{fd.interestRate}%</span></td>
                    <td className="font-mono font-bold text-emerald">₹{fd.maturityAmount?.toLocaleString()}</td>
                    <td>{fd.endDate}</td>
                    <td><span className="badge badge-emerald">{fd.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No active Fixed Deposit accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FD;
