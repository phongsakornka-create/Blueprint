const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

router.get("/me", leaveController.getMyRequests);
router.get("/calendar", leaveController.getCalendar);
router.get("/", requireRole(["head", "staff", "admin"]), leaveController.getAllRequests);
router.post("/", leaveController.create);

router.patch("/:id/approve", requireRole(["head", "admin"]), leaveController.approve);
router.patch("/:id/reject", requireRole(["head", "admin"]), leaveController.reject);

module.exports = router;
