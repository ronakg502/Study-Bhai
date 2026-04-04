const router = require("express").Router();
const {
  chatWithAI,
  generateFlashcards,
  generateQnA,
  generateSummary,
  solveProb,
} = require("../controllers/aiController");

router.post("/chat",       chatWithAI);
router.post("/flashcards", generateFlashcards);
router.post("/qna",        generateQnA);
router.post("/summary",    generateSummary);
router.post("/solve",      solveProb);

module.exports = router;