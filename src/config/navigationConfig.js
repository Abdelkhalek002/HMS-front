import { PERMISSIONS, hasPermission } from '../utils/permissionUtils';
import {
  isCounterRole,
  isMedicalCheckManagerRole,
  isTransferRole,
  isExternalHospitalAdminRole,
  USERTYPE,
} from '../ActorType';

/**
 * Canonical navigation schema for the Admin workspace.
 * Each navigation tab is linked to its required backend permission.
 */
export const ADMIN_NAV_ITEMS = [
  {
    path: '/ad',
    title: 'الكاونتر',
    icon: 'desktop_windows',
    permission: PERMISSIONS.RESERVATIONS_READ,
    exact: true,
  },
  {
    path: '/ad/transfer',
    title: 'تحويلات',
    icon: 'move_up',
    permission: PERMISSIONS.TRANSFERS_READ,
    exact: true,
  },
  {
    path: '/ad/admins',
    title: 'المسؤولين',
    icon: 'groups',
    permission: PERMISSIONS.ADMINS_READ,
  },
  {
    path: '/ad/allusers',
    title: 'المستخدمين',
    icon: 'groups',
    permission: PERMISSIONS.USERS_READ,
  },
  {
    path: '/ad/history',
    title: 'السجل',
    icon: 'history',
    permission: PERMISSIONS.LOGS_READ,
  },
  {
    path: '/ad/system-data',
    title: 'بيانات النظام',
    icon: 'storage',
    permission: PERMISSIONS.ADMINS_READ,
  },
];

/**
 * Resolves the first authorized destination route based on permissions and role.
 */
export const getAuthorizedInitialRoute = (permissions = [], role = '') => {
  if (!role || role === USERTYPE || role === 'user') {
    return '/';
  }

  // Specialized single-purpose workspaces
  if (isCounterRole(role) || isMedicalCheckManagerRole(role)) {
    return '/co';
  }
  if (isTransferRole(role) || isExternalHospitalAdminRole(role)) {
    return '/tr';
  }

  // Find first tab authorized by permissions
  const firstAuthorized = ADMIN_NAV_ITEMS.find((item) =>
    hasPermission(permissions, item.permission)
  );

  return firstAuthorized ? firstAuthorized.path : '/ad';
};
