<p align="center">
  <img src="https://img.shields.io/badge/⚡_CodeSensei-AI_Code_Reviewer-7C3AED?style=for-the-badge&labelColor=1a1a2e" alt="CodeSensei" />
</p>

<h1 align="center">CodeSensei</h1>
<p align="center"><strong>AI-powered code reviewer built for developers</strong></p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini_2.5-Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="License MIT" /></a>
  <a href="https://github.com/Soubhik19/AI-code-reviewer/stargazers"><img src="https://img.shields.io/github/stars/Soubhik19/AI-code-reviewer?style=flat-square&color=f59e0b" alt="GitHub Stars" /></a>
</p>

---

## 🧠 What is CodeSensei?

CodeSensei is a full-stack AI code review application that analyzes your code in seconds and delivers structured, actionable feedback. Powered by Google's Gemini 2.5 Flash model, it identifies security vulnerabilities, performance bottlenecks, and code smells — then provides a complete refactored version of your code with a professional score breakdown. Built with a sleek dark-themed UI, it's the code reviewer that never sleeps.

---

## ✨ Features

- 🔍 **Instant AI Code Review** — Paste any code and get a structured review in seconds
- 🌐 **Multi-Language Support** — JavaScript, TypeScript, Python, Go, and Java
- ⚠️ **Issue Detection with Severity** — Critical, High, Medium, Low severity labels
- 🚀 **Refactored Code Output** — Complete production-ready rewrite of your code
- 📊 **Score Table** — Readability, Performance, Security, Best Practices (X/10)
- 📋 **Inline Copy Buttons** — One-click copy on every code block
- 🎨 **Professional Dark Theme** — Clean UI with JetBrains Mono font
- ⚡ **Error Handling** — Graceful error states with descriptive messages
- 🏠 **Landing Page** — Animated hero section with particle canvas

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · TypeScript 5.9 · Vite 5 |
| **Styling** | Tailwind CSS 4.1 · shadcn/ui · JetBrains Mono |
| **Backend** | Node.js · Express 5 |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Markdown** | react-markdown · rehype-highlight · Prism.js |
| **Deployment** | Vercel (Frontend + Backend) |

---

## 📁 Project Structure

```
AI-code-reviewer/
├── BackEnd/
│   ├── server.js                  # Entry point — Express server
│   ├── vercel.json                # Vercel serverless config
│   ├── .env.example               # Environment variable template
│   └── src/
│       ├── app.js                 # Express app setup, CORS, routes
│       ├── controllers/
│       │   └── ai.controller.js   # Request validation & error handling
│       ├── routes/
│       │   └── ai.routes.js       # POST /ai/get-review
│       └── Services/
│           └── ai.services.js     # Gemini API integration & prompt
│
├── Frontend/
│   ├── vite.config.ts             # Vite build configuration
│   ├── .env                       # Environment variables
│   └── src/
│       ├── App.tsx                # Root app with page routing
│       ├── index.css              # Global styles & dark theme
│       ├── pages/
│       │   ├── LandingPage.tsx    # Animated landing page
│       │   └── ReviewerPage.tsx   # Main code review interface
│       └── components/
│           ├── landing/
│           │   ├── Navbar.tsx     # Navigation bar
│           │   ├── Hero.tsx       # Hero section with animations
│           │   ├── Features.tsx   # Feature showcase cards
│           │   ├── HowItWorks.tsx # Step-by-step guide
│           │   ├── CTA.tsx        # Call-to-action section
│           │   ├── Footer.tsx     # Site footer
│           │   └── ParticleCanvas.tsx  # Background particles
│           └── ui/               # shadcn/ui component library
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** 9+
- **Google Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Soubhik19/AI-code-reviewer.git
cd AI-code-reviewer
```

### 2. Set Up the Backend

```bash
cd BackEnd
cp .env.example .env
```

Edit `BackEnd/.env` with your values:

```env
GEMINI_API_KEY=your_google_api_key_here
PORT=4000
FRONTEND_URL=http://localhost:5173
```

Install dependencies and start:

```bash
npm install
node server.js
```

You should see: `✅ CodeReview AI backend running on http://localhost:4000`

### 3. Set Up the Frontend

```bash
cd ../Frontend
```

Create `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

---

## 📡 API Reference

### `POST /ai/get-review`

Sends code to the Gemini AI and returns a structured markdown review.

**Request:**

```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}
```

**Response:** `text/plain` — Markdown string containing:

| Section | Description |
|---------|-------------|
| 🔍 Overview | 2–3 sentence quality summary |
| ⚠️ Issues | Up to 5 issues with severity + fix snippets |
| ✅ Strengths | What's done well (max 3 bullets) |
| 🚀 Refactored Code | Complete clean rewrite |
| 📊 Score | Readability, Performance, Security, Best Practices |

**Status Codes:**

| Code | Meaning |
|------|---------|
| `200` | Review returned successfully |
| `400` | Missing or invalid `code` field / code exceeds 8000 chars |
| `429` | Gemini API rate limit hit |
| `500` | Internal server error |

---

## 🗺️ Roadmap

- [x] **Phase 1** — UI redesign with dark theme, landing page, and component architecture
- [x] **Phase 2** — Backend hardening, Gemini 2.5 Flash upgrade, structured prompt engineering
- [ ] **Phase 3** — RAG-enhanced advanced reviewer with codebase context awareness
- [ ] **Phase 4** — User authentication, review history, and file upload support
- [ ] **Phase 5** — Streaming responses for real-time review output

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 💜 by <a href="https://github.com/Soubhik19"><strong>Soubhik Samanta</strong></a>
</p>
