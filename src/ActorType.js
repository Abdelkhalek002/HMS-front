export const USERTYPE = `user`;
export const SUPERADMINTYPE = `مدير النظام`;
export const COUNTERTYPE = `كاونتر`;
export const VIEWERTYPE = `ملاحظ`;
export const TRANSFERTYPE = `مسؤول التحويلات`;

// Legacy / backend hash codes mappings for backward compatibility
export const LEGACY_SUPERADMIN = `hsh_2_sa_4`;
export const LEGACY_COUNTER = `hsh_3#co#0`;
export const LEGACY_VIEWER = `hsh_4*ob*5`;
export const LEGACY_TRANSFER = `hsh_1&tr&0`;

const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '');

// Helper predicates to reliably check role regardless of whether backend returns Arabic string, hash code, or enum:
export const isSuperAdminRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === SUPERADMINTYPE ||
    role === LEGACY_SUPERADMIN ||
    r === "super_admin" ||
    r === "superadmin"
  );
};

export const isCounterRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === COUNTERTYPE ||
    role === LEGACY_COUNTER ||
    r === "counter"
  );
};

export const isTransferRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === TRANSFERTYPE ||
    role === LEGACY_TRANSFER ||
    r === "transfer" ||
    r === "transfer_clerk"
  );
};

export const isViewerRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === VIEWERTYPE ||
    role === LEGACY_VIEWER ||
    r === "viewer" ||
    r === "observer"
  );
};

export const isAdminDashboardRole = (role) =>
  isSuperAdminRole(role) || isViewerRole(role);
