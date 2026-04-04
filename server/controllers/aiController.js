const { generateAIResponse, generateJSONResponse } = require("../services/aiService");

const MAX_CONTEXT = 8000; // safe token limit

function trimContext(text) {
  if (!text) return "No material uploaded.";
  return text.length > MAX_CONTEXT
    ? text.slice(0, MAX_CONTEXT) + "\n\n[...content truncated for length...]"
    : text;
}

// Safely parse the JSON string returned by Groq's json_object mode
function parseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    // Strip any accidental markdown fences and retry
    const cleaned = raw.replace(/```(?:json|JSON)?\s*/g, "").replace(/```/g, "").trim();
    try { return JSON.parse(cleaned); } catch (_) {}
    // Last resort: bracket extraction
    const obj = cleaned.match(/\{[\s\S]*\}/);
    if (obj) try { return JSON.parse(obj[0]); } catch (_) {}
    const arr = cleaned.match(/\[[\s\S]*\]/);
    if (arr) try { return JSON.parse(arr[0]); } catch (_) {}
    throw new Error("Could not parse AI response. Please try again.");
  }
}

// ── Chat ─────────────────────────────────────────────────────────
exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    const prompt = `You are a helpful study assistant. Use the material below to answer the student's question clearly and concisely.

Material:
${trimContext(context)}

Student Question:
${message}

Answer in a helpful, educational tone. Be thorough but easy to understand.`;

    const reply = await generateAIResponse(prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Flashcards ───────────────────────────────────────────────────
exports.generateFlashcards = async (req, res) => {
  try {
    const { context } = req.body;

    const system = `You are a study assistant that ONLY responds with valid JSON.
You will generate flashcards based on study material.
Your entire response must be a single valid JSON object with a "cards" array.
Never include markdown, explanations, or text outside the JSON.`;

    const user = `Generate 10 flashcards based on this study material:

${trimContext(context)}

Return this exact JSON structure:
{
  "cards": [
    { "front": "question or concept", "back": "clear answer", "topic": "topic tag" }
  ]
}
Generate exactly 10 cards covering different topics from the material.`;

    const raw = await generateJSONResponse(system, user);
    const parsed = parseJSON(raw);

    // Support both {cards:[...]} and [...] shaped responses
    const cards = Array.isArray(parsed) ? parsed : (parsed.cards || []);
    if (!cards.length) throw new Error("AI returned empty cards. Try again.");
    res.json({ cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Q&A ──────────────────────────────────────────────────────────
exports.generateQnA = async (req, res) => {
  try {
    const { context } = req.body;

    const system = `You are a study assistant that ONLY responds with valid JSON.
You will generate exam-style Q&A pairs based on study material.
Your entire response must be a single valid JSON object with a "questions" array.
Never include markdown, explanations, or text outside the JSON.`;

    const user = `Generate 10 exam-style Q&A pairs from this study material:

${trimContext(context)}

Return this exact JSON structure (difficulty must be exactly "Easy", "Medium", or "Hard"):
{
  "questions": [
    {
      "question": "exam question",
      "answer": "detailed answer (2-4 sentences)",
      "difficulty": "Easy",
      "topic": "topic tag"
    }
  ]
}

Generate exactly 10 questions. Mix: 4 Easy, 3 Medium, 3 Hard.`;

    const raw = await generateJSONResponse(system, user);
    const parsed = parseJSON(raw);
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    if (!questions.length) throw new Error("AI returned empty questions. Try again.");
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Summary ───────────────────────────────────────────────────────
exports.generateSummary = async (req, res) => {
  try {
    const { context } = req.body;

    const system = `You are a study assistant that ONLY responds with valid JSON.
You will summarize study material.
Your entire response must be a single valid JSON object.
Never include markdown, explanations, or text outside the JSON.`;

    const user = `Summarize this study material:

${trimContext(context)}

Return this exact JSON structure:
{
  "title": "subject title (3-6 words)",
  "keyPoints": [
    "key takeaway 1",
    "key takeaway 2",
    "key takeaway 3",
    "key takeaway 4",
    "key takeaway 5"
  ],
  "sections": [
    {
      "heading": "section heading",
      "content": "2-3 sentence explanation",
      "icon": "one emoji"
    }
  ]
}

Include 4-5 sections covering the major topics.`;

    const raw = await generateJSONResponse(system, user);
    const summary = parseJSON(raw);
    if (!summary.keyPoints || !summary.sections) throw new Error("Incomplete summary. Please try again.");
    if (!summary.title) summary.title = "AI Summary";
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Problem Solver ────────────────────────────────────────────────
exports.solveProb = async (req, res) => {
  try {
    const { problem } = req.body;

    const system = `You are an expert tutor that ONLY responds with valid JSON.
You will solve problems step by step.
Your entire response must be a single valid JSON object.
Never include markdown, explanations, or text outside the JSON.`;

    const user = `Solve this problem step by step:

${problem}

Return this exact JSON structure:
{
  "steps": [
    {
      "step": 1,
      "title": "step name (3-6 words)",
      "content": "detailed explanation with formulas and working"
    }
  ],
  "finalAnswer": "the final answer in plain text"
}

Use 3-6 steps. Show all working clearly.`;

    const raw = await generateJSONResponse(system, user);
    const solution = parseJSON(raw);
    if (!solution.steps || !Array.isArray(solution.steps)) throw new Error("Solution missing steps. Please try again.");
    res.json({ solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};