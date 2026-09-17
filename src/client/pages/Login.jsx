import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus, FaLandmark } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (isRegister && password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister 
        ? { username, email, password }
        : { username, password };

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

      if (res.data.token) {
        login(res.data.token, res.data.user);
        setMessage({ text: isRegister ? 'Account registered successfully!' : 'Login successful!', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Authentication failed. Please try again.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-card">
        <div className="auth-header">
          <div className="brand-logo-center">
            <div className="logo-icon"><FaLandmark /></div>
            <h2>NOVA CREST <span>BANK</span></h2>
          </div>
          <p className="auth-subtitle">
            {isRegister ? 'Create your secure digital banking account' : 'Welcome back! Sign in to access your portal'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="auth-tabs">
          <button 
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setMessage({ text: '', type: '' }); }}
          >
            <FaSignInAlt /> Login
          </button>
          <button 
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setMessage({ text: '', type: '' }); }}
          >
            <FaUserPlus /> Register
          </button>
        </div>

        {message.text && (
          <div className={`alert-box alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><FaUser /> Username</label>
            <input 
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label><FaEnvelope /> Email Address</label>
              <input 
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label><FaLock /> Password</label>
            <input 
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label><FaLock /> Confirm Password</label>
              <input 
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
