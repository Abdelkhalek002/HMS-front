/**
 * Permission Utilities for Dynamic Permission-Based Access Control (PBAC).
 * Supports backend canonical permissions, wildcard '*', and multi-permission checks.
 */

export const PERMISSIONS = Object.freeze({
  // Admins & System Management
  ADMINS_READ: 'admins:read',
  ADMINS_CREATE: 'admins:create',
  ADMINS_UPDATE: 'admins:update',
  ADMINS_DELETE: 'admins:delete',
  SYSTEM_DATA_READ: 'system_data:read',
  SYSTEM_DATA_WRITE: 'system_data:write',
  STATS_READ: 'stats:read',
  LOGS_READ: 'logs:read',
  LOGS_DELETE: 'logs:delete',

  // Users (Students / Patients) Management
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',

  // Reservations & Counter
  RESERVATIONS_READ: 'reservations:read',
  RESERVATIONS_WRITE: 'reservations:write',
  RESERVATIONS_APPROVE: 'reservations:approve',
  RESERVATIONS_DELETE: 'reservations:delete',

  // Transfers
  TRANSFERS_READ: 'transfers:read',
  TRANSFERS_WRITE: 'transfers:write',
  TRANSFERS_APPROVE: 'transfers:approve',
});

/**
 * Checks whether user permissions satisfy the required permission.
 * Wildcard '*' grants access to all capabilities.
 * If required is an array, defaults to OR check (user has at least one).
 */
export const hasPermission = (userPermissions = [], requiredPermission) => {
  if (!requiredPermission) return true;
  if (!Array.isArray(userPermissions)) return false;
  if (userPermissions.includes('*')) return true;

  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((perm) => userPermissions.includes(perm));
  }

  return userPermissions.includes(requiredPermission);
};

/**
 * Checks whether user permissions satisfy ALL required permissions.
 */
export const hasAllPermissions = (userPermissions = [], requiredPermissions = []) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!Array.isArray(userPermissions)) return false;
  if (userPermissions.includes('*')) return true;

  return requiredPermissions.every((perm) => userPermissions.includes(perm));
};
