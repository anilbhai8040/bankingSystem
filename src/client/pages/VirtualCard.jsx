import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCreditCard, FaLock, FaUnlock, FaKey, FaSync, FaShieldAlt } from 'react-icons/fa';
import './VirtualCard.css';

const VirtualCard = () => {
  const { activeAccount } = useContext(AuthContext);
  const [accountNumber, setAccountNumber] = useState(activeAccount || '1002003001');
  const [card, setCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Change PIN state
  const [newPin, setNewPin] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const fetchCard = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/virtual-card/details?account_number=${accountNumber}`);
      setCard(res.data.card);
    } catch (error) {
      console.error('Error fetching virtual card:', error);
    }
  };

  useEffect(() => {
    fetchCard();
  }, [accountNumber]);

  const handleToggleStatus = async (serviceAction) => {
    setMessage({ text: '', type: '' });
    try {
      const res = await axios.post('http://localhost:5000/api/virtual-card/status', {
        account_number: accountNumber,
        service: serviceAction,
      });

      setMessage({ text: res.data.message, type: 'success' });
      fetchCard();
    } catch (error) {
      const errText = error.response?.data?.message || 'Error updating card status.';
      setMessage({ text: errText, type: 'error' });
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/virtual-card/change-pin', {
        account_number: accountNumber,
        new_pin: newPin,
      });

      setMessage({ text: res.data.message, type: 'success' });
      setNewPin('');
      fetchCard();
    } catch (error) {
      const errText = error.response?.data?.message || 'Error changing PIN.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaCreditCard /> Virtual <span className="gradient-text">Debit Card</span></h1>
        <p className="page-subtitle">Manage digital card permissions, flip 3D card preview, and reset security PIN.</p>
      </div>

      <div className="card-management-grid">
        {/* 3D Interactive Card Flip Display */}
        <div className="card-display-section">
          <div className={`virtual-card-3d ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
            {/* FRONT OF CARD */}
            <div className={`card-face card-front ${card?.status === 'Blocked' ? 'card-blocked' : ''}`}>
              <div className="card-top">
                <span className="card-bank-name">NOVA CREST BANK</span>
                <span className={`badge ${card?.status === 'Active' ? 'badge-emerald' : 'badge-rose'}`}>
                  {card?.status || 'Active'}
                </span>
              </div>

              <div className="card-middle">
                <div className="chip-icon"></div>
                <div className="card-num-text">{card?.cardNumber || '4532 8910 2341 9012'}</div>
              </div>

              <div className="card-bottom">
                <div className="card-holder">
                  <span className="card-label">CARD HOLDER</span>
                  <span className="card-val">{card?.cardHolderName || 'VALUED CUSTOMER'}</span>
                </div>
                <div className="card-expiry">
                  <span className="card-label">EXPIRES</span>
                  <span className="card-val">{card?.expiryDate || '12/29'}</span>
                </div>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="card-face card-back">
              <div className="magnetic-strip"></div>
              <div className="cvv-container">
                <span className="cvv-label">SECURITY CVV</span>
                <div className="cvv-box">{card?.cvv || '888'}</div>
              </div>
              <p className="card-disclaimer font-mono">
                This virtual debit card is issued by Nova Crest Bank. For assistance call 1800-NOVA-CREST.
              </p>
            </div>
          </div>

          <p className="flip-hint text-center text-muted">
            <FaSync /> Click card to flip front/back view
          </p>
        </div>

        {/* Controls & Security Actions */}
        <div className="glass-card card-controls-card">
          <h3 className="section-subtitle"><FaShieldAlt /> Card Controls</h3>

          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label>Linked Savings Account Number</label>
            <input 
              type="text"
              className="form-input font-mono"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {/* Quick Toggle Actions */}
          <div className="card-action-btns">
            {card?.status === 'Active' ? (
              <button 
                onClick={() => handleToggleStatus('block_card')} 
                className="btn-rose w-full py-3"
              >
                <FaLock /> Block Card (Disable Card)
              </button>
            ) : (
              <button 
                onClick={() => handleToggleStatus('activate_card')} 
                className="btn-primary w-full py-3"
              >
                <FaUnlock /> Activate Card
              </button>
            )}
          </div>

          {/* PIN Reset Form */}
          <form onSubmit={handleChangePin} className="pin-form mt-4">
            <h4 className="control-title"><FaKey /> Change Card PIN</h4>
            <div className="form-group">
              <input 
                type="password"
                className="form-input font-mono"
                placeholder="Enter 4-digit PIN"
                maxLength="4"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-secondary w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update PIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
