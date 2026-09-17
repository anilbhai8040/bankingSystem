import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaTrashAlt, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import './DeleteAccount.css';

const DeleteAccount = () => {
  const { activeAccount, changeActiveAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '');
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirmCheckbox) {
      setMessage({ text: 'Please check the confirmation box to proceed.', type: 'error' });
      return;
    }

    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await axios.delete(`http://localhost:5000/api/account/delete/${accountNumber}`);
      setMessage({ text: res.data.message, type: 'success' });
      
      // Reset active account
      changeActiveAccount('');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const errText = error.response?.data?.message || 'Error deleting account. Please verify account number.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title text-rose"><FaTrashAlt /> Delete <span className="gradient-text-rose">Bank Account</span></h1>
        <p className="page-subtitle">Permanently close and delete a savings account from Nova Crest Bank ledger.</p>
      </div>

      <div className="glass-card delete-card">
        <div className="warning-banner">
          <FaExclamationTriangle className="warning-icon" />
          <div>
            <h4>Warning: Action is Irreversible!</h4>
            <p>Deleting an account will terminate all linked virtual debit cards, active fixed deposits, and recurring interest logs associated with this account.</p>
          </div>
        </div>

        {message.text && (
          <div className={`alert-box alert-${message.type} mt-4`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleDelete} className="delete-form mt-4">
          <div className="form-group">
            <label>Target Account Number to Delete *</label>
            <input 
              type="text"
              className="form-input font-mono text-lg"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox"
              id="confirmDelete"
              checked={confirmCheckbox}
              onChange={(e) => setConfirmCheckbox(e.target.checked)}
            />
            <label htmlFor="confirmDelete">
              I understand that closing account <b>{accountNumber || 'XXXX'}</b> is permanent and cannot be undone.
            </label>
          </div>

          <button type="submit" className="btn-rose w-full py-3" disabled={loading || !confirmCheckbox}>
            {loading ? 'Deleting Account...' : <><FaTrashAlt /> Permanently Delete Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
