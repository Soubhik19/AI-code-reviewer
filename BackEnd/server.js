'use strict';
const dotenv = require('dotenv');
dotenv.config();

// ── Startup guard ────────────────────────────────────────────────────────────
if (!process.env.GEMINI_API_KEY) {
  console.error(
    '\n❌  FATAL: GEMINI_API_KEY is not set in your environment.\n' +
    '    Create a .env file in the BackEnd/ directory and add:\n' +
    '    GEMINI_API_KEY=your_key_here\n'
  );
  process.exit(1);
}

const app  = require('./src/app');
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅  CodeReview AI backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;