# CodeSensei — AI Code Reviewer

An AI-powered code review tool built with React + Vite (frontend) and Node.js + Express + Gemini API (backend).

## Features

- 🤖 Senior-level AI code reviews via Google Gemini
- 🎨 Syntax-highlighted code editor with language selector
- 📋 Markdown-rendered review output with copy-to-clipboard
- 🌙 Dark theme with particle animation landing page
- ⚡ Fast, responsive two-panel layout

## Tech Stack

**Frontend:** React 19 · TypeScript · Vite 5 · Tailwind CSS v4 · shadcn/ui  
**Backend:** Node.js · Express 5 · Google Gemini API (`gemini-2.0-flash`)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Backend Setup

```bash
cd BackEnd
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
# .env is already configured for local dev
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
AI-code-reviewer/
├── BackEnd/
│   ├── src/
│   │   ├── Services/ai.services.js   ← Gemini API wrapper
│   │   ├── controllers/              ← Request handlers + validation
│   │   └── routes/                   ← Express routes
│   ├── server.js                     ← Entry point with startup guard
│   └── .env.example
└── Frontend/
    ├── src/
    │   ├── components/               ← UI components
    │   ├── pages/                    ← LandingPage + ReviewerPage
    │   └── index.css                 ← Design tokens + global styles
    └── index.html
```

## License

MIT
