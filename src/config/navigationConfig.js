import { PERMISSIONS, hasPermission } from '../utils/permissionUtils';
import {
  isCounterRole,
  isTransferRole,
  USERTYPE,
} from '../ActorType';
import { ROUTES } from '../routes/routePaths';

/**
 * Canonical navigation schema for the Staff / Management workspace.
 * Each navigation tab is linked to its required backend permission.
 */
export const STAFF_NAV_ITEMS = [
  {
    path: ROUTES.STAFF.RESERVATIONS,
    title: 'الحجوزات والكاونتر',
    icon: 'desktop_windows',
    permission: PERMISSIONS.RESERVATIONS_READ,
    exact: true,
  },
  {
    path: ROUTES.STAFF.TRANSFERS,
    title: 'التحويلات الطبية',
    icon: 'move_up',
    permission: PERMISSIONS.TRANSFERS_READ,
    exact: true,
  },
  {
    path: ROUTES.STAFF.USERS,
    title: 'المستخدمين والطلاب',
    icon: 'groups',
    permission: PERMISSIONS.USERS_READ,
  },
  {
    path: ROUTES.STAFF.LOGS,
    title: 'سجل العمليات',
    icon: 'history',
    permission: PERMISSIONS.LOGS_READ,
  },
  {
    path: ROUTES.STAFF.SYSTEM_DATA,
    title: 'بيانات النظام',
    icon: 'storage',
    permission: PERMISSIONS.ADMINS_READ,
  },
  {
    path: ROUTES.STAFF.ADMINS,
    title: 'إدارة المسؤولين',
    icon: 'shield',
    permission: PERMISSIONS.ADMINS_READ,
  },
];

// Alias for backwards compatibility
export const ADMIN_NAV_ITEMS = STAFF_NAV_ITEMS;

/**
 * Resolves the first authorized destination route based on permissions and role.
 */
export const getAuthorizedInitialRoute = (permissions = [], role = '') => {
  if (!role || role === USERTYPE || role === 'user') {
    return ROUTES.HOME;
  }

  // Find first tab authorized by permissions
  const firstAuthorized = STAFF_NAV_ITEMS.find((item) =>
    hasPermission(permissions, item.permission)
  );
  if (firstAuthorized) {
    return firstAuthorized.path;
  }

  // Fallbacks by role if permissions array is empty/unspecified
  if (isCounterRole(role)) {
    return ROUTES.STAFF.RESERVATIONS;
  }
  if (isTransferRole(role)) {
    return ROUTES.STAFF.TRANSFERS;
  }

  return ROUTES.STAFF.RESERVATIONS;
};
