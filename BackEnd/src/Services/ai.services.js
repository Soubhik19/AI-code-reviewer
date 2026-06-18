const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

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
- Max 5 issues only
- Always show complete refactored code
- Always fill the score table
- Be direct, no fluff, no intros like "Sure! I'd be happy to..."
- Never say "Great code!" or give empty praise
- Always check for: security vulnerabilities, performance bottlenecks, error handling, code smells, type safety
- Keep total response under 600 words excluding code blocks
- Use the exact language name (${language}) in code blocks for syntax highlighting
- In the Refactored Code section, write CLEAN production code with MINIMAL comments. Only add a comment if it explains a non-obvious safety or business decision. Do NOT add tutorial-style comments like "// Use strict equality" or "// Await the JSON parsing". The code should speak for itself.

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

  const result = await model.generateContent(prompt);
  if (!result?.response) {
    throw new Error('No response received from Gemini API');
  }
  return result.response.text();
}

module.exports = { generateContent };
