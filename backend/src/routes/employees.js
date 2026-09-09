const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

// ดึงรายชื่อสาขาวิชา (ทุกคนที่ login แล้วสามารถดึงไปแสดงใน dropdown ได้)
router.get("/meta/departments", employeeController.getDepartments);

// head/staff/admin ดูรายชื่อได้ (ขอบเขตข้อมูลคุมใน controller)
router.get("/", requireRole(["head", "staff", "admin"]), employeeController.getAll);
router.get("/:id", requireRole(["head", "staff", "admin"]), employeeController.getById);

// admin และ staff จัดการข้อมูลบุคลากรได้
router.post("/", requireRole(["admin", "staff"]), employeeController.create);
router.put("/:id", requireRole(["admin", "staff"]), employeeController.update);
router.delete("/:id", requireRole(["admin"]), employeeController.remove);

module.exports = router;
