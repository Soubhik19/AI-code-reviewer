const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order — if the primary is overloaded, fall back
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

/**
 * Sleep for the given number of milliseconds.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Tries to generate content with retry + model fallback.
 * - Up to 2 retries per model with exponential backoff.
 * - Falls through the MODEL_CHAIN on persistent 503/429 errors.
 */
async function callWithRetry(prompt) {
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`[ai.service] Trying ${modelName} (attempt ${attempt + 1})…`);
        const result = await model.generateContent(prompt);
        if (!result?.response) {
          throw new Error('No response received from Gemini API');
        }
        console.log(`[ai.service] ✅ Success with ${modelName}`);
        return result.response.text();
      } catch (err) {
        lastError = err;
        const status = err?.status ?? err?.httpStatusCode ?? err?.errorDetails?.[0]?.reason;
        const message = err?.message ?? '';

        console.error(`[ai.service] ${modelName} attempt ${attempt + 1} failed:`, message);

        // If it's a 503 (overloaded) or 429 (rate limit), retry with backoff
        if (message.includes('503') || message.includes('429') ||
            message.includes('UNAVAILABLE') || message.includes('RESOURCE_EXHAUSTED') ||
            message.includes('overloaded') || message.includes('quota') ||
            message.includes('high demand') ||
            status === 503 || status === 429) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
          console.log(`[ai.service] Retrying in ${delay}ms…`);
          await sleep(delay);
          continue;
        }

        // For other errors (auth, bad request, etc.), throw immediately
        throw err;
      }
    }
    console.log(`[ai.service] All retries exhausted for ${modelName}, trying next model…`);
  }

  // All models and retries exhausted
  throw lastError || new Error('All Gemini models failed after retries');
}

/**
 * Sends the user's code to Gemini and returns the markdown review string.
 * @param {string} language - The programming language (e.g. "javascript")
 * @param {string} code - The raw code to review
 * @returns {Promise<string>}
 */
async function generateContent(language, code) {
  const prompt = `
You are an expert senior code reviewer with 10+ years of experience.
Review the following ${language} code and provide a structured, professional review.

STRICT RULES:
- Max 5 issues only. If the code is already excellent, robust, and follows best practices, DO NOT invent fake issues or nitpicks. Instead, state "No major issues found." under the Issues section.
- If the code requires no changes, give 10/10 scores and output the exact original code in the Refactored Code section.
- Always show complete refactored code.
- Always fill the score table.
- Be direct, no fluff, no intros like "Sure! I'd be happy to..."
- Never say "Great code!" or give empty praise.
- Always check for: security vulnerabilities, performance bottlenecks, error handling, code smells, type safety.
- Keep total response under 600 words excluding code blocks.
- Use the exact language name (${language}) in code blocks for syntax highlighting.
- CRITICAL: Prioritize CONCISENESS. The refactored code MUST NOT be significantly longer than the original code.
- DO NOT add JSDoc blocks, type definitions, or overly verbose error handling unless explicitly necessary to fix a critical bug.
- DO NOT over-engineer. Keep the logic simple and elegant.
- In the Refactored Code section, write CLEAN production code with NO comments unless absolutely necessary to explain a complex business rule. The code should speak for itself.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🔍 Overview
[2-3 sentence summary of code quality]

## ⚠️ Issues
### [Issue Name] — Severity: Critical/High/Medium/Low
**Problem:** [one clear sentence]
**Fix:**
\`\`\`${language}
[fixed code snippet]
\`\`\`

## ✅ Strengths
- [2-3 bullet points of what is done well]

## 🚀 Refactored Code
\`\`\`${language}
[complete clean rewritten version]
\`\`\`

## 📊 Score
| Category | Score | Reason |
|----------|-------|--------|
| Readability | X/10 | [one word reason] |
| Performance | X/10 | [one word reason] |
| Security | X/10 | [one word reason] |
| Best Practices | X/10 | [one word reason] |

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`
`;

  return callWithRetry(prompt);
}

module.exports = { generateContent };
