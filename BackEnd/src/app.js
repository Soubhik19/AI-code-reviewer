const express   = require('express');
const cors      = require('cors');
const aiRoutes  = require('./routes/ai.routes');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow the frontend origin(s) from env, plus common Vercel preview URLs.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

// Also allow any *.vercel.app origin for preview deployments
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any vercel.app subdomain
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(null, false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'CodeReview AI Backend' });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/ai', aiRoutes);

module.exports = app;
