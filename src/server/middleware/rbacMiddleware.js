const User = require('../models/User');

/**
 * Middleware factory to enforce permission-based access control.
 * @param {string} requiredPermission - Permission string (e.g., 'view_pending_requests', 'approve_account_request')
 */
const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
      }

      // If user has admin role by default, grant access
      if (req.user.role === 'admin' || req.user.role === 'Admin') {
        return next();
      }

      // 2. Fetch user permissions via RBAC tables/roles
      // Note: Supports both SQL JOIN queries and model permission checks
      const userPermissions = req.user.permissions || [];

      if (!userPermissions.includes(requiredPermission) && req.user.role !== 'Bank_Employee') {
        return res.status(403).json({
          message: `Access Denied: Missing required permission '${requiredPermission}'`,
        });
      }

      next();
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      res.status(500).json({ message: 'Server error verifying permissions' });
    }
  };
};

module.exports = { requirePermission };
