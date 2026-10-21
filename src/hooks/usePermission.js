import { useSelector } from 'react-redux';
import { getUserInfo } from '../features/auth';
import { hasPermission, hasAllPermissions, PERMISSIONS } from '../utils/permissionUtils';
import { isSuperAdminRole, isViewerRole } from '../ActorType';

/**
 * Custom hook to perform permission checks anywhere in the application.
 * Retrieves current user auth state and permissions from Redux.
 */
export const usePermission = () => {
  const auth = useSelector(getUserInfo);

  const permissions =
    auth?.user?.permissions ||
    auth?.data?.permissions ||
    auth?.payLoad?.permissions ||
    [];

  const role =
    auth?.user?.role ||
    auth?.data?.role ||
    auth?.payLoad?.role ||
    null;

  const isSuperAdmin = isSuperAdminRole(role) || permissions.includes('*');
  const isObserver = isViewerRole(role);

  const can = (requiredPermission) => hasPermission(permissions, requiredPermission);
  const canAll = (requiredPermissions) => hasAllPermissions(permissions, requiredPermissions);
  const canAny = (requiredPermissions) => hasPermission(permissions, requiredPermissions);

  /**
   * Action / Mutation check:
   * Observers are strictly read-only for auditing, so canMutate is always false for them.
   * SuperAdmins can mutate unless restricted.
   * Other roles must possess the required write/mutation permission.
   */
  const canMutate = (requiredPermission) => {
    if (isObserver) return false;
    if (isSuperAdmin) return true;
    return hasPermission(permissions, requiredPermission);
  };

  return {
    can,
    canAll,
    canAny,
    canMutate,
    permissions,
    role,
    isSuperAdmin,
    isObserver,
    PERMISSIONS,
  };
};

export default usePermission;
