import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated, requiredRoles, ...rest }) => {
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!requiredRoles.some(role => isAuthenticated.roles.includes(role))) {
    return <Navigate to="/forbidden" replace />;
  }

  // Render the protected route
  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
