const jwt = require("jsonwebtoken");

/**
 * requireAuth
 * เช็ค JWT token จาก Authorization header (Bearer token)
 * ถ้าถูกต้อง จะแนบ req.user = { id, role, department_id } ไว้ให้ route ถัดไปใช้
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "ไม่พบ token กรุณาเข้าสู่ระบบ" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, department_id }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
}

/**
 * requireRole(['admin', 'head'])
 * ต้องใช้ต่อจาก requireAuth เสมอ (ต้องมี req.user ก่อน)
 */
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
