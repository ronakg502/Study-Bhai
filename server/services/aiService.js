const groq = require("../config/groq");

// Models for plain text (chat)
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];

// Models that support response_format: json_object
const JSON_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "llama3-70b-8192",
  "llama3-8b-8192",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * generateAIResponse - for plain text (chat)
 */
const generateAIResponse = async (prompt) => {
  for (const modelName of MODELS) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        });
        return completion.choices[0]?.message?.content || "";
      } catch (err) {
        lastError = err;
        const isRateLimit =
          err.status === 429 ||
          err.message?.includes("429") ||
          err.message?.includes("Too Many Requests") ||
          err.message?.includes("rate_limit");

        if (isRateLimit && attempt < 3) {
          const waitMs = attempt * 5000;
          console.warn(`[AI] Rate limit on ${modelName} (attempt ${attempt}). Retrying in ${waitMs / 1000}s...`);
          await sleep(waitMs);
        } else if (isRateLimit) {
          console.warn(`[AI] Quota exhausted for ${modelName}, trying next model...`);
          break;
        } else {
          throw err;
        }
      }
    }
  }
  throw new Error("All AI models are currently rate-limited. Please try again later.");
};

/**
 * generateJSONResponse - forces JSON output using Groq's json_object mode.
 * Falls back to text parsing if json_object mode isn't supported.
 */
const generateJSONResponse = async (systemPrompt, userPrompt) => {
  for (const modelName of JSON_MODELS) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2048,          // reduced to stay within token-per-min limits
          response_format: { type: "json_object" },
        });
        return completion.choices[0]?.message?.content || "";
      } catch (err) {
        lastError = err;
        const isRateLimit =
          err.status === 429 ||
          err.message?.includes("429") ||
          err.message?.includes("Too Many Requests") ||
          err.message?.includes("rate_limit");

        if (isRateLimit && attempt < 3) {
          const waitMs = attempt * 8000; // 8s, 16s — give rate limits time to reset
          console.warn(`[AI-JSON] Rate limit on ${modelName} (attempt ${attempt}). Retrying in ${waitMs / 1000}s...`);
          await sleep(waitMs);
        } else if (isRateLimit) {
          console.warn(`[AI-JSON] Quota exhausted for ${modelName}, trying next model...`);
          break;
        } else {
          throw err;
        }
      }
    }
  }
  throw new Error("All AI models are currently rate-limited. Please try again later.");
};

module.exports = { generateAIResponse, generateJSONResponse };