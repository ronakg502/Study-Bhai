const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadMaterial } = require("../controllers/materialController");

router.post("/upload", upload.single("file"), uploadMaterial);

module.exports = router;