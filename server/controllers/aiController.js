const { generateAIResponse } = require("../services/aiService");

exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const prompt = `
You are a study assistant.

Material:
${context}

User Question:
${message}

Also generate:
- Summary
- Important Points
`;

    const reply = await generateAIResponse(prompt);

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};