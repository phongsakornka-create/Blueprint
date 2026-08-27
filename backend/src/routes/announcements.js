const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", announcementController.getAll);
router.post("/", requireRole(["staff", "admin"]), announcementController.create);
router.put("/:id", requireRole(["staff", "admin"]), announcementController.update);
router.delete("/:id", requireRole(["staff", "admin"]), announcementController.remove);

module.exports = router;
