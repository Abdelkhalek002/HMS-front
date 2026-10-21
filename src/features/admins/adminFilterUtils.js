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

  switch (filterRole) {
    case 'super_admin':
      return isSuperAdminRole(adminRole);
    case 'counter':
      return isCounterRole(adminRole);
    case 'transfer':
      return isTransferRole(adminRole);
    case 'viewer':
      return isViewerRole(adminRole);
    default:
      return String(adminRole || '').toLowerCase() === String(filterRole).toLowerCase();
  }
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
  const isActive = Boolean(rawActive === 1 || rawActive === true || rawActive === '1' || rawActive === 'active');

  if (filterStatus === 'active') {
    return isActive && !isBlocked;
  }
  if (filterStatus === 'inactive') {
    return !isActive && !isBlocked;
  }
  return true;
};
