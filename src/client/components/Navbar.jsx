import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaLandmark, FaBars, FaLock, FaSignOutAlt, FaUser, FaShieldAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, activeAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const isEmployee = user && (user.role === 'Bank_Employee' || user.role === 'admin' || user.role === 'Employee');

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button className="mobile-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Navigation Sidebar">
            <FaBars />
          </button>
          <Link to="/" className="brand-logo">
            <div className="logo-icon">
              <FaLandmark />
            </div>
            <div className="logo-text">
              <span>NOVA CREST</span> <span className="highlight">BANK</span>
            </div>
          </Link>
        </div>

        {/* Top Horizontal Navigation for Desktop */}
        <nav className="nav-menu desktop-only-menu">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>About Us</Link>
          <Link to="/blog" className={isActive('/blog')}>Blog</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          
          {user ? (
            isEmployee ? (
              <Link to="/employee-dashboard" className={isActive('/employee-dashboard')}>
                <span className="text-purple-bright"><FaShieldAlt /> Employee Portal</span>
              </Link>
            ) : (
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            )
          ) : (
            <Link to="/create-account" className={isActive('/create-account')}>Open Account</Link>
          )}
        </nav>

        <div className="nav-actions">
          {user && (
            <div className="account-chip" title="Current Active Account">
              <span className="dot"></span> Acc: {activeAccount}
            </div>
          )}

          {user ? (
            <div className="user-profile">
              <span className="user-name">
                <FaUser /> {user.username}
                <small className="user-role-tag">({user.role || 'User'})</small>
              </span>
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
