const openai = require("../config/openai");

const generateAIResponse = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

module.exports = { generateAIResponse };