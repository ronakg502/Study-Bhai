const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");

// All project routes require authentication
router.use(authMiddleware);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

module.exports = router;
