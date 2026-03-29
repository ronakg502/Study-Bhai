const router = require("express").Router();
const { chatWithAI } = require("../controllers/aiController");

router.post("/chat", chatWithAI);

module.exports = router;