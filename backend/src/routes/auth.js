const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  login,
  me,
  logout,
  loginWithGoogle,
  updateProfile,
  updateAvatar,
  changePassword,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/login", login);
router.post("/google", loginWithGoogle);
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);
router.post("/avatar", requireAuth, upload.single("avatar"), updateAvatar);
router.put("/change-password", requireAuth, changePassword);
router.post("/logout", requireAuth, logout);

module.exports = router;
