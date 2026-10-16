import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo, logout } from '../../RTK/Auth/AuthSlice';
import { isTokenExpired } from '../../API_Route/axiosInterceptor';
import { usePermission } from '../../hooks/usePermission';

/**
 * Route guard component that verifies whether the authenticated user
 * has the required permission to access the nested route.
 */
export const PermissionProtect = ({ requiredPermission, fallback = '/notfound' }) => {
  const dispatch = useDispatch();
  const auth = useSelector(getUserInfo);
  const { can } = usePermission();

  if (!auth || !auth.token) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired(auth.token)) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default PermissionProtect;
