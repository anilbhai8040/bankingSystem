import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaHome, FaInfoCircle, FaBlog, FaEnvelope, FaUserPlus, 
  FaSignInAlt, FaChartLine, FaPlusCircle, FaMinusCircle, 
  FaHistory, FaSearch, FaPiggyBank, FaCoins, FaCreditCard, 
  FaTrashAlt, FaShieldAlt, FaTimes, FaLock, FaUserCheck
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, closeSidebar }) => {
  const { user } = useContext(AuthContext);

  const isEmployee = user && (user.role === 'Bank_Employee' || user.role === 'admin' || user.role === 'Employee');
  const isCustomer = user && !isEmployee;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-badge-box">
            {user ? (
              <span className={`role-badge ${isEmployee ? 'badge-employee' : 'badge-customer'}`}>
                {isEmployee ? <FaShieldAlt /> : <FaUserCheck />} {user.role || 'Customer'}
              </span>
            ) : (
              <span className="role-badge badge-guest">
                <FaLock /> Guest Access
              </span>
            )}
          </div>

          <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Section 1: Public Pages (Always Available) */}
          <div className="menu-group">
            <div className="menu-heading">Main Pages</div>
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <FaHome className="nav-icon text-cyan" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <FaInfoCircle className="nav-icon text-purple" />
              <span>About Us</span>
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <FaBlog className="nav-icon text-emerald" />
              <span>Blog</span>
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <FaEnvelope className="nav-icon text-amber" />
              <span>Contact Us</span>
            </NavLink>
          </div>

          {/* Section 2: Guest Actions (When NOT Logged In) */}
          {!user && (
            <div className="menu-group guest-group">
              <div className="menu-heading">Account Onboarding</div>
              <NavLink to="/create-account" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaUserPlus className="nav-icon text-cyan" />
                <span>Open Account</span>
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `sidebar-link login-highlight ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaSignInAlt className="nav-icon" />
                <span>Login</span>
              </NavLink>
            </div>
          )}

          {/* Section 3: Customer Banking Services (ONLY WHEN LOGGED IN AS CUSTOMER) */}
          {user && (
            <div className="menu-group">
              <div className="menu-heading">Banking Services</div>
              <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaChartLine className="nav-icon text-purple" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/deposit" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaPlusCircle className="nav-icon text-emerald" />
                <span>Add Money (Deposit)</span>
              </NavLink>

              <NavLink to="/withdraw" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaMinusCircle className="nav-icon text-amber" />
                <span>Withdraw</span>
              </NavLink>

              <NavLink to="/check-balance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaSearch className="nav-icon text-cyan" />
                <span>Check Balance</span>
              </NavLink>

              <NavLink to="/statements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaHistory className="nav-icon text-purple" />
                <span>Statements</span>
              </NavLink>

              <NavLink to="/fd" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaPiggyBank className="nav-icon text-emerald" />
                <span>Fixed Deposit (FD)</span>
              </NavLink>

              <NavLink to="/gold-loan" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaCoins className="nav-icon text-amber" />
                <span>Gold Loan</span>
              </NavLink>

              <NavLink to="/virtual-card" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaCreditCard className="nav-icon text-cyan" />
                <span>Virtual Card</span>
              </NavLink>
            </div>
          )}

          {/* Section 4: Employee / Admin Portal (ONLY WHEN LOGGED IN AS EMPLOYEE/ADMIN) */}
          {isEmployee && (
            <div className="menu-group employee-group">
              <div className="menu-heading">Employee Portal</div>
              <NavLink to="/employee-dashboard" className={({ isActive }) => `sidebar-link employee-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaShieldAlt className="nav-icon text-purple" />
                <span>Employee Dashboard</span>
              </NavLink>
            </div>
          )}

          {/* Section 5: Account Settings (When Logged In) */}
          {user && (
            <div className="menu-group">
              <div className="menu-heading">Account Control</div>
              <NavLink to="/delete-account" className={({ isActive }) => `sidebar-link danger-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
                <FaTrashAlt className="nav-icon" />
                <span>Close Account</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="sidebar-footer">
          <div className="footer-status">
            <span className="dot-green"></span> Nova Core v2.4 Security Active
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
