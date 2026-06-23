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

    const message = err?.message ?? '';

    // Quota exhausted
    if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        message: 'API quota exceeded. The free tier limit has been reached. Please try again in a few minutes or upgrade the API plan.'
      });
    }

    // Service overloaded
    if (message.includes('503') || message.includes('UNAVAILABLE') || message.includes('overloaded') || message.includes('high demand')) {
      return res.status(503).json({
        message: 'AI service is temporarily overloaded. Please try again in a few seconds.'
      });
    }

    // API key issues
    if (message.includes('401') || message.includes('API_KEY') || message.includes('PERMISSION_DENIED')) {
      return res.status(500).json({
        message: 'AI service authentication error. Please check the API key configuration.'
      });
    }

    return res.status(500).json({ message: 'AI service failed. Please try again later.' });
  }
};