const aiService = require('../Services/ai.services');

/**
 * POST /ai/get-review
 * Body: { code: string, language?: string }
 * Returns: plain-text markdown string
 */
module.exports.getReview = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    // ── Input validation ──────────────────────────────────────────────────
    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ message: 'code is required and must be a non-empty string.' });
    }

    if (code.length > 8000) {
      return res.status(400).json({ message: 'Code too long. Maximum 8000 characters allowed.' });
    }

    // ── Call AI service ───────────────────────────────────────────────────
    const review = await aiService.generateContent(language, code);
    return res.send(review);

  } catch (err) {
    console.error('[ai.controller] Error:', err?.message ?? err);

    const status = err?.status ?? err?.response?.status;
    if (status === 429) {
      return res.status(429).json({ message: 'Rate limit hit. Please wait a moment and try again.' });
    }

    return res.status(500).json({ message: 'AI service failed. Please try again later.' });
  }
};