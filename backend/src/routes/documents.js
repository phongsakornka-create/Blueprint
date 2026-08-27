const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { requireAuth } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.use(requireAuth);

router.get("/", documentController.getAll);
router.post("/", upload.single("file"), documentController.upload);
router.delete("/:id", documentController.remove);

module.exports = router;
