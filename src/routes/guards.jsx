import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logout } from '../features/auth';
import { isTokenExpired } from '../services/http';
import { usePermission } from '../hooks/usePermission';
import { ROUTES } from './routePaths';
import { getAuthorizedInitialRoute } from '../config/navigationConfig';

/**
 * Base authentication wrapper that verifies token presence and validity.
 */
export const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return children || <Outlet />;
};

/**
 * Route guard for normal user (student / patient) pages.
 * Redirects staff (Admins, Counters, Transfers, Observers) to their resource portal.
 */
export const UserGuard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const userObj = userData.user || userData.payLoad || userData.data || {};
  const role = userObj.role || userData.payLoad?.role;
  const isUser = !role || role === 'user' || userObj.type === 'user';

  if (isUser) {
    return <Outlet />;
  }

  const permissions = userObj.permissions || userData.payLoad?.permissions || [];
  const targetRoute = getAuthorizedInitialRoute(permissions, role);
  return <Navigate to={targetRoute} replace />;
};

/**
 * Route guard for internal staff members (Admins, Counters, Transfers, Observers).
 * Disallows regular students from viewing staff resources.
 */
export const StaffGuard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const userObj = userData.user || userData.payLoad || userData.data || {};
  const role = userObj.role || userData.payLoad?.role;
  const isUser = !role || role === 'user' || userObj.type === 'user';

  if (isUser) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

// Aliases for StaffGuard to keep existing code compatible
export const AdminGuard = StaffGuard;
export const CounterGuard = StaffGuard;
export const TransferGuard = StaffGuard;

/**
 * Route guard for granular permissions.
 */
export const PermissionGuard = ({ requiredPermission, fallback = '/notfound' }) => {
  const dispatch = useDispatch();
  const auth = useSelector(getUserInfo);
  const { can, isSuperAdmin } = usePermission();

  if (!auth || !auth.token || isTokenExpired(auth.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (requiredPermission && !isSuperAdmin && !can(requiredPermission)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

/**
 * Route guard that prevents students with pending documents from viewing
 * profile or change password pages until their documents are approved.
 */
export const StudentDocumentGuard = () => {
  const userData = useSelector((state) => state.UserSlice?.data);
  const auth = useSelector(getUserInfo);

  const docStatus =
    userData?.document_status ||
    auth?.user?.document_status ||
    auth?.payLoad?.document_status ||
    (userData?.status === 'approved' ? 'approved' : 'pending');

  const isDocumentPending = docStatus === 'pending';

  if (isDocumentPending) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

const guards = {
  AuthGuard,
  UserGuard,
  StaffGuard,
  AdminGuard,
  CounterGuard,
  TransferGuard,
  PermissionGuard,
  StudentDocumentGuard,
};

export default guards;
