import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLandmark, FaWallet, FaUserPlus, FaHistory, FaCreditCard, FaCoins, FaLock, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, activeAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <FaLandmark />
          </div>
          <div className="logo-text">
            <span>NOVA CREST</span> <span className="highlight">BANK</span>
          </div>
        </Link>

        <nav className="nav-menu">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <FaWallet /> Dashboard
          </Link>
          <Link to="/create-account" className={isActive('/create-account')}>
            <FaUserPlus /> Open Account
          </Link>
          <Link to="/deposit" className={isActive('/deposit')}>
            Deposit
          </Link>
          <Link to="/withdraw" className={isActive('/withdraw')}>
            Withdraw
          </Link>
          <Link to="/statements" className={isActive('/statements')}>
            <FaHistory /> Statements
          </Link>
          <Link to="/fd" className={isActive('/fd')}>
            Fixed Deposit
          </Link>
          <Link to="/gold-loan" className={isActive('/gold-loan')}>
            <FaCoins /> Gold Loan
          </Link>
          <Link to="/virtual-card" className={isActive('/virtual-card')}>
            <FaCreditCard /> Virtual Card
          </Link>
        </nav>

        <div className="nav-actions">
          <div className="account-chip" title="Current Active Account">
            <span className="dot"></span> Acc: {activeAccount}
          </div>

          {user ? (
            <div className="user-profile">
              <span className="user-name"><FaUser /> {user.username}</span>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link-btn">
              <FaLock /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
