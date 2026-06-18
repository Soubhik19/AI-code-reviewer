import { useState, useEffect, useRef } from "react"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticleCanvas } from "./ParticleCanvas"
import LottieAnim from "./LottieAnim"
import heroAnimation from "../../../public/hero-animation.json"

interface HeroProps {
  onStartReviewing: () => void
}

const LANGUAGES = ["JavaScript", "Python", "TypeScript", "Go", "Java", "Rust", "C++"]
const TYPEWRITER_TEXT = "instantly, intelligently."
const TYPE_SPEED = 80
const DELETE_SPEED = 45
const PAUSE_AFTER_TYPE = 2000
const PAUSE_AFTER_DELETE = 600

const CODE_LINES = [
  "const app = express();",
  "function mergeSort(arr) {",
  "  if (arr.length <= 1) return arr;",
  "  const mid = Math.floor(arr.length / 2);",
  "  return merge(mergeSort(arr.slice(0, mid)),",
  "    mergeSort(arr.slice(mid)));",
  "}",
  "async function fetchData(url) {",
  "  const res = await fetch(url);",
  "  return res.json();",
  "}",
  "class Node { constructor(val) {",
  "  this.val = val; this.next = null;",
  "}}",
  "import React from 'react';",
  "const [state, setState] = useState(0);",
  "export default function App() {",
  "  return <div>Hello World</div>;",
  "}",
  "router.get('/api/users', async (req, res) => {",
  "  const users = await User.find();",
  "  res.json(users);",
  "});",
  "def quicksort(arr):",
  "  if len(arr) <= 1: return arr",
  "  pivot = arr[len(arr) // 2]",
  "  return quicksort(left) + middle + quicksort(right)",
  "fn main() { println!(\"Hello\"); }",
  "type Result<T> = Ok(T) | Err(Error);",
  "interface User { id: string; name: string; }",
]

function useTypewriter(text: string) {
  const [displayed, setDisplayed] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const phase = useRef<"typing" | "pausing" | "deleting" | "paused-empty">("typing")
  const idx = useRef(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      if (phase.current === "typing") {
        if (idx.current < text.length) {
          idx.current++
          setDisplayed(text.slice(0, idx.current))
          timer = setTimeout(tick, TYPE_SPEED)
        } else {
          phase.current = "pausing"
          timer = setTimeout(tick, PAUSE_AFTER_TYPE)
        }
      } else if (phase.current === "pausing") {
        phase.current = "deleting"
        timer = setTimeout(tick, DELETE_SPEED)
      } else if (phase.current === "deleting") {
        if (idx.current > 0) {
          idx.current--
          setDisplayed(text.slice(0, idx.current))
          timer = setTimeout(tick, DELETE_SPEED)
        } else {
          phase.current = "paused-empty"
          timer = setTimeout(tick, PAUSE_AFTER_DELETE)
        }
      } else {
        phase.current = "typing"
        timer = setTimeout(tick, TYPE_SPEED)
      }
    }

    timer = setTimeout(tick, TYPE_SPEED)
    return () => clearTimeout(timer)
  }, [text])

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 530)
    return () => clearInterval(blink)
  }, [])

  return { displayed, showCursor }
}

export function Hero({ onStartReviewing }: HeroProps) {
  const { displayed, showCursor } = useTypewriter(TYPEWRITER_TEXT)

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pt-16 sm:px-6 lg:px-8">
      {/* Scrolling code lines background */}
      <div aria-hidden className="code-rain-container">
        <div className="code-rain">
          {[...CODE_LINES, ...CODE_LINES].map((line, i) => (
            <div key={i} className="code-rain-line">{line}</div>
          ))}
        </div>
      </div>

      {/* Particle background */}
      <ParticleCanvas />

      {/* Background glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.22 265 / 18%) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/2 size-[400px] -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.62 0.18 240 / 12%) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-2/3 size-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.22 265 / 10%) 0%, transparent 70%)",
        }}
      />

      {/* Two-column hero layout */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14">
        {/* LEFT column — all existing content */}
        <div className="hero-content flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm text-brand-light">
            <span className="pulse-dot size-2 rounded-full bg-brand" />
            AI-Powered Code Analysis
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Your code reviewed
            <br />
            <span className="gradient-text-animated">
              {displayed}
              <span
                style={{
                  opacity: showCursor ? 1 : 0,
                  transition: "opacity 0.1s",
                  marginLeft: "2px",
                }}
              >
                |
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Paste your code and get senior-level feedback in seconds. Bugs, security issues,
            performance — caught before they ship.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              onClick={onStartReviewing}
              className="bg-brand text-primary-foreground hover:bg-brand-light gap-2 px-7 font-semibold transition-all hover:scale-105"
            >
              Review my code →
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 border-white/10 bg-white/5 text-foreground hover:bg-white/10"
            >
              <a
                href="https://github.com/Soubhik19/AI-code-reviewer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                CodeSensei — AI Code Reviewer
              </a>
            </Button>
          </div>

          {/* Language badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {LANGUAGES.map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT column — Lottie robot */}
        <div className="hero-robot flex-shrink-0">
          <div className="hero-robot-float">
            <LottieAnim
              animationData={heroAnimation}
              className="hero-robot-size"
            />
          </div>
        </div>
      </div>

      {/* Mock UI Preview */}
      <div className="relative z-10 mt-14 w-full max-w-4xl">
        <div className="overflow-hidden rounded-xl border border-white/8 bg-[oklch(0.13_0.03_265)] shadow-2xl shadow-black/40">
          {/* Window title bar */}
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-yellow-500/80" />
            <span className="size-3 rounded-full bg-green-500/80" />
            <span className="mx-auto text-xs text-muted-foreground/60">codesensei — review.js</span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-white/5 md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Left: Code */}
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brand" />
                <span className="text-xs font-medium text-muted-foreground">Code Editor</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[oklch(0.82_0.03_265)]">
                <code>{`async function fetchUser(id) {
  const res = await fetch('/api/users/' + id);
  const data = res.json(); // ← missing await

  if (data.role == 'admin') { // ← == vs ===
    return data;
  }

  // password exposed in response
  return { user: data.name, pwd: data.password };
}`}</code>
              </pre>
            </div>

            {/* Right: Review comments */}
            <div className="flex flex-col gap-3 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-green-400" />
                <span className="text-xs font-medium text-muted-foreground">Review</span>
              </div>

              <div className="flex gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
                <div>
                  <p className="text-xs font-semibold text-red-400">Missing await on res.json()</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Returns a Promise, not the parsed data. Add await before res.json().
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-400" />
                <div>
                  <p className="text-xs font-semibold text-yellow-400">Use strict equality (===)</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Loose equality can cause type coercion bugs. Always prefer ===.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-lg border border-red-600/20 bg-red-600/5 p-3">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                <div>
                  <p className="text-xs font-semibold text-red-500">Security: Password exposed</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Never return sensitive fields like password in API responses.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-400" />
                <div>
                  <p className="text-xs font-semibold text-green-400">Good: async/await usage</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Correct async function pattern. Clean and readable structure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom glow under card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "oklch(0.55 0.22 265 / 20%)" }}
        />
      </div>

      {/* Scroll fade bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to top, oklch(0.105 0.025 265) 0%, transparent 100%)",
        }}
      />
    </section>
  )
}
