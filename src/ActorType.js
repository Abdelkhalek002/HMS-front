export const USERTYPE = `user`;
export const SUPERADMINTYPE = `مدير النظام`;
export const COUNTERTYPE = `كاونتر`;
export const SECONDSUPERADMIN = `مدير ثان`;
export const VIEWERTYPE = `ملاحظ`;
export const TRANSFERTYPE = `مسئول التحويلات`;
export const MEDICAL_CHECK_MANAGER = `مسئول الكشف الطبي`;
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

// Helper predicates to reliably check role regardless of whether backend returns Arabic string or hash code:
export const isSuperAdminRole = (role) =>
  role === SUPERADMINTYPE ||
  role === LEGACY_SUPERADMIN ||
  role === "super_admin";

export const isSecondSuperAdminRole = (role) =>
  role === SECONDSUPERADMIN ||
  role === LEGACY_SECONDSUPERADMIN ||
  role === "second_manager";

export const isCounterRole = (role) =>
  role === COUNTERTYPE || role === LEGACY_COUNTER || role === "counter";

export const isTransferRole = (role) =>
  role === TRANSFERTYPE ||
  role === LEGACY_TRANSFER ||
  role === "transfer" ||
  role === "transfer_clerk";

export const isViewerRole = (role) =>
  role === VIEWERTYPE ||
  role === LEGACY_VIEWER ||
  role === "viewer" ||
  role === "observer";

export const isMedicalCheckManagerRole = (role) =>
  role === MEDICAL_CHECK_MANAGER ||
  role === LEGACY_MEDICAL_CHECK_MANAGER_1 ||
  role === LEGACY_MEDICAL_CHECK_MANAGER_2 ||
  role === "medical_check_manager";

export const isExternalHospitalAdminRole = (role) =>
  role === EXTERNAL_HOSPITAL_ADMIN ||
  role === LEGACY_EXTERNAL_HOSPITAL ||
  role === "external_hospital_admin";

export const isAdminDashboardRole = (role) =>
  isSuperAdminRole(role) || isSecondSuperAdminRole(role) || isViewerRole(role);
