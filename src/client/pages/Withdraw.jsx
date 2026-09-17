import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaArrowUp, FaCheckCircle, FaReceipt } from 'react-icons/fa';
import './TransactionPages.css';

const Withdraw = () => {
  const { activeAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '1002003001');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setReceipt(null);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/transactions/withdraw', {
        account_number: accountNumber,
        amount: Number(amount),
      });

      setMessage({ text: res.data.message, type: 'success' });
      setReceipt(res.data);
      setAmount('');
    } catch (error) {
      const errText = error.response?.data?.message || 'Error processing withdrawal.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaArrowUp className="text-rose" /> Withdraw <span className="gradient-text">Funds</span></h1>
        <p className="page-subtitle">Instant account withdrawal with automated balance validation.</p>
      </div>

      <div className="txn-card-grid">
        <div className="glass-card txn-form-card">
          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleWithdraw} className="txn-form">
            <div className="form-group">
              <label>Source Account Number *</label>
              <input 
                type="text"
                className="form-input font-mono"
                placeholder="10-digit Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Withdrawal Amount (₹) *</label>
              <input 
                type="number"
                className="form-input font-mono text-lg"
                placeholder="Enter withdrawal amount"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full btn-rose" disabled={loading}>
              {loading ? 'Processing...' : <><FaCheckCircle /> Confirm Withdrawal</>}
            </button>
          </form>
        </div>

        {/* Digital Receipt */}
        {receipt && (
          <div className="glass-card receipt-card">
            <div className="receipt-header">
              <FaReceipt className="receipt-icon" />
              <h3>Transaction Receipt</h3>
              <span className="badge badge-rose">WITHDRAWAL</span>
            </div>

            <div className="receipt-body font-mono">
              <div className="receipt-row">
                <span>Txn ID:</span>
                <span>{receipt.transaction?.transactionId}</span>
              </div>
              <div className="receipt-row">
                <span>Account Number:</span>
                <span>{receipt.transaction?.accountNumber}</span>
              </div>
              <div className="receipt-row">
                <span>Transaction Type:</span>
                <span className="text-rose">WITHDRAWAL</span>
              </div>
              <div className="receipt-row">
                <span>Amount Debited:</span>
                <span className="text-rose font-bold">- ₹{receipt.transaction?.amount?.toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>Remaining Balance:</span>
                <span className="font-bold">₹{receipt.newBalance?.toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span>Timestamp:</span>
                <span>{receipt.transaction?.date} {receipt.transaction?.time}</span>
              </div>
            </div>

            <button onClick={() => window.print()} className="btn-secondary w-full mt-4">
              Print Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
