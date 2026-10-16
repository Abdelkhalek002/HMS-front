export const USERTYPE = `user`;
export const SUPERADMINTYPE = `مدير النظام`;
export const COUNTERTYPE = `كاونتر`;
export const SECONDSUPERADMIN = `مدير ثان`;
export const VIEWERTYPE = `ملاحظ`;
export const TRANSFERTYPE = `مسؤول التحويلات`;
export const MEDICAL_CHECK_MANAGER = `مسؤول الكشف الطبي`;
export const EXTERNAL_HOSPITAL_ADMIN = `أدمن مستشفي خارجي`;

// Legacy / backend hash codes mappings for backward compatibility
export const LEGACY_SUPERADMIN = `hsh_2_sa_4`;
export const LEGACY_COUNTER = `hsh_3#co#0`;
export const LEGACY_SECONDSUPERADMIN = `hsh_2!sm!6`;
export const LEGACY_VIEWER = `hsh_4*ob*5`;
export const LEGACY_TRANSFER = `hsh_1&tr&0`;
export const LEGACY_MEDICAL_CHECK_MANAGER_1 = `hsh_$mcm$9`;
export const LEGACY_MEDICAL_CHECK_MANAGER_2 = `hsh__mcm_9`;
export const LEGACY_EXTERNAL_HOSPITAL = `hsh_5*bh*3`;

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

export const isSecondSuperAdminRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === SECONDSUPERADMIN ||
    role === LEGACY_SECONDSUPERADMIN ||
    r === "second_manager" ||
    r === "secondsuperadmin"
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

export const isMedicalCheckManagerRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === MEDICAL_CHECK_MANAGER ||
    role === LEGACY_MEDICAL_CHECK_MANAGER_1 ||
    role === LEGACY_MEDICAL_CHECK_MANAGER_2 ||
    r === "medical_check_manager"
  );
};

export const isExternalHospitalAdminRole = (role) => {
  const r = normalizeRole(role);
  return (
    role === EXTERNAL_HOSPITAL_ADMIN ||
    role === LEGACY_EXTERNAL_HOSPITAL ||
    r === "external_hospital_admin"
  );
};

export const isAdminDashboardRole = (role) =>
  isSuperAdminRole(role) || isSecondSuperAdminRole(role) || isViewerRole(role);
