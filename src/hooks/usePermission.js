import { useSelector } from 'react-redux';
import { getUserInfo } from '../features/auth';
import { hasPermission, hasAllPermissions, PERMISSIONS } from '../utils/permissionUtils';
import { isSuperAdminRole } from '../ActorType';

/**
 * Custom hook to perform permission checks anywhere in the application.
 * Retrieves current user auth state and permissions from Redux.
 */
export const usePermission = () => {
  const auth = useSelector(getUserInfo);

  const permissions =
    auth?.user?.permissions ||
    auth?.data?.permissions ||
    [];

  const role =
    auth?.user?.role ||
    auth?.data?.role ||
    null;

  const isSuperAdmin = isSuperAdminRole(role) || permissions.includes('*');

  const can = (requiredPermission) => hasPermission(permissions, requiredPermission);
  const canAll = (requiredPermissions) => hasAllPermissions(permissions, requiredPermissions);
  const canAny = (requiredPermissions) => hasPermission(permissions, requiredPermissions);

  return {
    can,
    canAll,
    canAny,
    permissions,
    role,
    isSuperAdmin,
    PERMISSIONS,
  };
};

export default usePermission;
