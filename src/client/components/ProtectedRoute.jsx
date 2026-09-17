import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Restricts access to routes based on authentication status and user role.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center py-5">
        <div className="spinner"></div>
        <span className="ml-2 font-mono text-muted">Authenticating Nova Crest Session...</span>
      </div>
    );
  }

  // Without login, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role-based permission if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || 'Retail_Customer';
    const hasRole = allowedRoles.includes(userRole) || 
                    allowedRoles.includes(userRole.toLowerCase()) ||
                    (allowedRoles.includes('admin') && (userRole === 'Bank_Employee' || userRole === 'admin'));

    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
