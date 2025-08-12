import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles = null }) => {
  const { isAuthenticated, hasAnyRole } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasAnyRole(roles)) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h3 className="text-danger">Access Denied</h3>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
