const express   = require('express');
const cors      = require('cors');
const aiRoutes  = require('./routes/ai.routes');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Lock to the frontend origin defined in FRONTEND_URL, fallback to localhost.
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
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
