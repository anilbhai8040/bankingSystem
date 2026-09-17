import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCoins, FaCheckCircle, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';
import './GoldLoan.css';

const GoldLoan = () => {
  const { activeAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '1002003001');
  const [name, setName] = useState('');
  const [goldWeight, setGoldWeight] = useState(25);
  const [lockerNumber, setLockerNumber] = useState(108);
  const [loanAmount, setLoanAmount] = useState(85000);
  const [email, setEmail] = useState('');

  // Repayment form state
  const [repayLoanAcc, setRepayLoanAcc] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/loans/list?account_number=${accountNumber}`);
      setLoans(res.data.loans || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [accountNumber]);

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/loans/apply', {
        name,
        account_number: accountNumber,
        gold_weight: Number(goldWeight),
        locker_number: Number(lockerNumber),
        loan_amount: Number(loanAmount),
        email,
      });

      setMessage({ text: res.data.message, type: 'success' });
      fetchLoans();
    } catch (error) {
      const errText = error.response?.data?.message || 'Error processing loan application.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/loans/repay', {
        loan_account_number: repayLoanAcc,
        amount: Number(repayAmount),
      });

      setMessage({ text: res.data.message, type: 'success' });
      setRepayAmount('');
      fetchLoans();
    } catch (error) {
      const errText = error.response?.data?.message || 'Error processing loan repayment.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaCoins /> Gold Loan <span className="gradient-text">Management</span></h1>
        <p className="page-subtitle">Instant loan disbursal against gold ornaments at an attractive 8.5% p.a. interest rate.</p>
      </div>

      <div className="loan-grid">
        {/* Apply for Loan Form */}
        <div className="glass-card loan-form-card">
          <h3 className="section-subtitle"><FaCoins /> Apply for Gold Loan</h3>

          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleApplyLoan} className="loan-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Applicant Full Name</label>
                <input type="text" className="form-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Savings Account Number *</label>
                <input type="text" className="form-input font-mono" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Gold Weight (Grams) *</label>
                <input type="number" className="form-input font-mono" min="1" value={goldWeight} onChange={(e) => setGoldWeight(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Assigned Vault Locker #</label>
                <input type="number" className="form-input font-mono" value={lockerNumber} onChange={(e) => setLockerNumber(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Loan Amount (₹) *</label>
                <input type="number" className="form-input font-mono" min="5000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Applicant Email *</label>
              <input type="email" className="form-input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Processing...' : <><FaCheckCircle /> Submit Loan & Disburse Funds</>}
            </button>
          </form>
        </div>

        {/* Loan Repayment Widget */}
        <div className="glass-card loan-repay-card">
          <h3 className="section-subtitle"><FaMoneyBillWave /> Repay Interest or Loan Amount</h3>

          <form onSubmit={handleRepay} className="loan-form">
            <div className="form-group">
              <label>Select Active Loan Account # *</label>
              <select className="form-input font-mono" value={repayLoanAcc} onChange={(e) => setRepayLoanAcc(e.target.value)} required>
                <option value="">-- Choose Loan Account --</option>
                {loans.map(loan => (
                  <option key={loan._id || loan.loanAccountNumber} value={loan.loanAccountNumber}>
                    {loan.loanAccountNumber} - Principal: ₹{loan.loanAmount?.toLocaleString()} (Repaid: ₹{loan.repaidAmount?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Repayment Amount (₹) *</label>
              <input type="number" className="form-input font-mono" min="1" placeholder="Enter amount to pay" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} required />
            </div>

            <button type="submit" className="btn-secondary w-full">
              Make Repayment
            </button>
          </form>

          <div className="security-notice mt-4">
            <FaShieldAlt className="text-emerald" /> 
            <span>All pledged gold items are stored in high-security biometric vault lockers insured by Nova Crest Security.</span>
          </div>
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="glass-card table-card mt-4">
        <h3 className="section-subtitle">Active Gold Loans Linked to Acc: {accountNumber}</h3>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Loan Acc No</th>
                <th>Applicant Name</th>
                <th>Gold Weight</th>
                <th>Locker #</th>
                <th>Loan Amount</th>
                <th>Interest Rate</th>
                <th>Repaid Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <tr key={loan._id || loan.loanAccountNumber}>
                    <td className="font-mono">{loan.loanAccountNumber}</td>
                    <td>{loan.name}</td>
                    <td className="font-mono">{loan.goldWeight} g</td>
                    <td className="font-mono">#{loan.lockerNumber}</td>
                    <td className="font-mono font-bold">₹{loan.loanAmount?.toLocaleString()}</td>
                    <td><span className="badge badge-purple">{loan.interestRate}% p.a.</span></td>
                    <td className="font-mono text-emerald">₹{loan.repaidAmount?.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${loan.status === 'ACTIVE' ? 'badge-emerald' : 'badge-purple'}`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No active gold loans found for this account.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoldLoan;
