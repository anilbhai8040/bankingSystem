import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaHistory, FaSearch, FaFilter, FaFileDownload, FaPrint } from 'react-icons/fa';
import './Statements.css';

const Statements = () => {
  const { activeAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '1002003001');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatements = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/transactions/statements?account_number=${accountNumber}`;
      if (filterType) {
        url += `&type=${filterType}`;
      }
      const res = await axios.get(url);
      setStatements(res.data.statements || []);
    } catch (error) {
      console.error('Error fetching statements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, [accountNumber, filterType]);

  const filteredStatements = statements.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.transactionId?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.name?.toLowerCase().includes(term) ||
      s.amount?.toString().includes(term)
    );
  });

  return (
    <div className="statements-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaHistory /> Account <span className="gradient-text">Statements</span></h1>
        <p className="page-subtitle">View, filter, and audit detailed ledger logs for all account transactions.</p>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar glass-card">
        <div className="form-group flex-1">
          <label>Account Number</label>
          <input 
            type="text"
            className="form-input font-mono"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label><FaFilter /> Transaction Type</label>
          <select 
            className="form-input" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Transaction Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAWAL">Withdrawals</option>
            <option value="TRANSFER">Transfers</option>
            <option value="LOAN_DISBURSEMENT">Loans</option>
            <option value="FD_CREATION">Fixed Deposits</option>
          </select>
        </div>

        <div className="form-group flex-1">
          <label><FaSearch /> Search Log</label>
          <input 
            type="text"
            className="form-input"
            placeholder="Search by Txn ID, name, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="align-self-end">
          <button onClick={() => window.print()} className="btn-secondary">
            <FaPrint /> Print Statement
          </button>
        </div>
      </div>

      {/* Statement Table */}
      <div className="glass-card table-card">
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Account</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading transaction statements...</td>
                </tr>
              ) : filteredStatements.length > 0 ? (
                filteredStatements.map((txn) => (
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
                    <td className="text-muted">{txn.description || 'N/A'}</td>
                    <td className={`font-mono font-bold ${
                      txn.type === 'DEPOSIT' || txn.type === 'LOAN_DISBURSEMENT' ? 'text-emerald' : 'text-rose'
                    }`}>
                      {txn.type === 'DEPOSIT' || txn.type === 'LOAN_DISBURSEMENT' ? '+' : '-'} ₹{txn.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No transactions matching account number {accountNumber}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statements;
