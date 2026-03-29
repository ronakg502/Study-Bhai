const router = require("express").Router();
const {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

module.exports = router;
