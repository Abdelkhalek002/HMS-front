import {
  isSuperAdminRole,
  isCounterRole,
  isTransferRole,
  isViewerRole,
} from '../../ActorType';

export const matchesSearch = (item, query) => {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();

  const name = String(item?.username || item?.userName || item?.name || '').toLowerCase();
  const email = String(item?.email || '').toLowerCase();
  const phone = String(item?.phoneNumber || item?.phone || '').toLowerCase();
  const role = String(item?.role || '').toLowerCase();

  return name.includes(q) || email.includes(q) || phone.includes(q) || role.includes(q);
};

export const matchesRole = (adminRole, filterRole) => {
  if (!filterRole || filterRole === 'all') return true;

  const a = String(adminRole || '').toLowerCase();
  const f = String(filterRole || '').toLowerCase();

  if (f === 'super_admin' || f === 'superadmin') return isSuperAdminRole(adminRole);
  if (f === 'counter') return isCounterRole(adminRole);
  if (f === 'transfer' || f === 'transfer_clerk') return isTransferRole(adminRole);
  if (f === 'viewer' || f === 'observer') return isViewerRole(adminRole);
  if (f === 'medical_check_manager') return a === 'medical_check_manager';
  if (f === 'medical_tests_manager') return a === 'medical_tests_manager';

  return a === f;
};

export const isStatusActive = (statusVal) => {
  if (statusVal === true || statusVal === 1 || statusVal === '1') return true;
  if (statusVal === false || statusVal === 0 || statusVal === '0') return false;
  if (typeof statusVal === 'string') {
    const s = statusVal.trim().toUpperCase();
    return s === 'ACTIVE';
  }
  return false;
};

export const matchesStatus = (item, filterStatus) => {
  if (!filterStatus || filterStatus === 'all') return true;

  const isBlocked = Boolean(item?.blocked === 1 || item?.blocked === true || item?.blocked === '1');
  if (filterStatus === 'blocked') {
    return isBlocked;
  }

  const rawActive = item?.is_active !== undefined
    ? item?.is_active
    : (item?.status !== undefined ? item?.status : item?.active);
  const isActive = isStatusActive(rawActive);

  if (filterStatus === 'active') {
    return isActive && !isBlocked;
  }
  if (filterStatus === 'inactive') {
    return !isActive && !isBlocked;
  }
  return true;
};
