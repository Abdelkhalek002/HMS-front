import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logout } from '../features/auth';
import { isTokenExpired } from '../services/http';
import { usePermission } from '../hooks/usePermission';
import { ROUTES } from './routePaths';
import {
  isAdminDashboardRole,
  isCounterRole,
  isMedicalCheckManagerRole,
  isTransferRole,
  isExternalHospitalAdminRole,
  isSuperAdminRole,
  isSecondSuperAdminRole,
} from '../ActorType';

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
 * Route guard for normal user pages.
 * Redirects privileged staff (Admins, Counters, Transfers) to their dedicated portals.
 */
export const UserGuard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const userObj = userData.user || userData.payLoad || {};
  const role = userObj.role || userData.payLoad?.role;
  const isUser = !role || role === 'user' || userObj.type === 'user';

  if (isUser) {
    return <Outlet />;
  }

  if (isAdminDashboardRole(role)) {
    return <Navigate to={ROUTES.ADMIN.ROOT} replace />;
  }
  if (isCounterRole(role) || isMedicalCheckManagerRole(role)) {
    return <Navigate to={ROUTES.COUNTER.ROOT} replace />;
  }
  if (isTransferRole(role) || isExternalHospitalAdminRole(role)) {
    return <Navigate to={ROUTES.TRANSFER.ROOT} replace />;
  }

  return <Navigate to={ROUTES.ADMIN.ROOT} replace />;
};

/**
 * Route guard for admin dashboard pages.
 */
export const AdminGuard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const role = userData.user?.role || userData.payLoad?.role;
  if (isAdminDashboardRole(role)) {
    return <Outlet />;
  }

  return <Navigate to="/notfound" replace />;
};

/**
 * Route guard for counter staff pages.
 */
export const CounterGuard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const role = userData.user?.role || userData.payLoad?.role;
  if (
    isCounterRole(role) ||
    isMedicalCheckManagerRole(role) ||
    isSuperAdminRole(role) ||
    isSecondSuperAdminRole(role)
  ) {
    return <Outlet />;
  }

  return <Navigate to="/notfound" replace />;
};

/**
 * Route guard for transfer staff pages.
 */
export const TransferGuard = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserInfo);

  if (!userData || !userData.token || isTokenExpired(userData.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  const role = userData.user?.role || userData.payLoad?.role;
  if (
    isTransferRole(role) ||
    isExternalHospitalAdminRole(role) ||
    isSuperAdminRole(role) ||
    isSecondSuperAdminRole(role)
  ) {
    return <Outlet />;
  }

  return <Navigate to="/notfound" replace />;
};

/**
 * Route guard for granular permissions.
 */
export const PermissionGuard = ({ requiredPermission, fallback = '/notfound' }) => {
  const dispatch = useDispatch();
  const auth = useSelector(getUserInfo);
  const { can } = usePermission();

  if (!auth || !auth.token || isTokenExpired(auth.token)) {
    dispatch(logout());
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
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
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const guards = {
  AuthGuard,
  UserGuard,
  AdminGuard,
  CounterGuard,
  TransferGuard,
  PermissionGuard,
  StudentDocumentGuard,
};

export default guards;
