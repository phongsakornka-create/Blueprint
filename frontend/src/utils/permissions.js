/**
 * นิยามสิทธิ์การใช้งาน (Role-based Access Control)
 */

export const ROLES = {
  LECTURER: "lecturer",
  HEAD: "head",
  STAFF: "staff",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [ROLES.LECTURER]: "อาจารย์ / บุคลากร",
  [ROLES.HEAD]: "หัวหน้าสาขาวิชา",
  [ROLES.STAFF]: "เจ้าหน้าที่ฝ่ายบุคคล/คณะ",
  [ROLES.ADMIN]: "ผู้ดูแลระบบ (Admin)",
};

export const ROLE_COLORS = {
  [ROLES.LECTURER]: "bg-blue-100 text-blue-800 border-blue-200",
  [ROLES.HEAD]: "bg-purple-100 text-purple-800 border-purple-200",
  [ROLES.STAFF]: "bg-emerald-100 text-emerald-800 border-emerald-200",
  [ROLES.ADMIN]: "bg-rose-100 text-rose-800 border-rose-200",
};

/**
 * ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงฟีเจอร์หรือไม่
 */
export function hasRole(user, allowedRoles = []) {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
}

export function canApproveLeaves(role) {
  return role === ROLES.HEAD || role === ROLES.ADMIN;
}

export function canManageEmployees(role) {
  return role === ROLES.ADMIN;
}

export function canViewAllEmployees(role) {
  return role === ROLES.ADMIN || role === ROLES.STAFF || role === ROLES.HEAD;
}

export function canManageAnnouncements(role) {
  return role === ROLES.STAFF || role === ROLES.ADMIN;
}

export function canManageDocuments(role) {
  return role === ROLES.STAFF || role === ROLES.ADMIN;
}
