import { useState, useCallback, useEffect, type ReactNode } from "react"
import axios from "axios"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import hljs from "highlight.js"
import "prismjs/themes/prism-tomorrow.css"
import "highlight.js/styles/github-dark.css"
import ScoreDashboard, { type ScoreData } from "@/components/ScoreDashboard"
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels"

import {
  ArrowLeft,
  Code2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReviewerPageProps {
  onBack: () => void
}

type ReviewState = "idle" | "loading" | "success" | "error"

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "typescript", label: "TypeScript", icon: "🟦" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "go", label: "Go", icon: "🐹" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "solidity", label: "Solidity", icon: "💎" },
]

function getGrammar(lang: string) {
  try {
    return Prism.languages[lang] ?? Prism.languages.clike ?? Prism.languages.javascript
  } catch {
    return Prism.languages.javascript
  }
}

function highlightCode(code: string, lang: string): string {
  try {
    const grammar = getGrammar(lang)
    if (!grammar) return code
    return Prism.highlight(code, grammar, lang)
  } catch {
    return code
  }
}

/** Extracts raw text from React children nodes (for code blocks) */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (!node) return ""
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (typeof node === "object" && node !== null && "props" in node) {
    return extractText((node as any).props.children)
  }
  return ""
}

/** Inline copy button that appears on hover over each code block */
function CopyCodeButton({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false)

  const handleCopyBlock = async () => {
    const text = extractText(children).trim()
    await navigator.clipboard.writeText(text)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  return (
    <button
      onClick={handleCopyBlock}
      className="absolute right-2 top-2 z-10 rounded-md border border-white/10 bg-white/5 p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-white/10 hover:text-foreground group-hover:opacity-100"
      title="Copy code"
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

function extractScores(markdown: string): ScoreData | null {
  const scores: ScoreData = {
    readability: 0, performance: 0, security: 0, bestPractices: 0,
    reasons: { readability: "", performance: "", security: "", bestPractices: "" }
  }
  let hasScores = false
  
  const readMatch = markdown.match(/\|\s*Readability\s*\|\s*(\d+)\/10\s*\|\s*(.*?)\s*\|/i)
  if (readMatch) { scores.readability = parseInt(readMatch[1]); scores.reasons.readability = readMatch[2].trim(); hasScores = true }
  
  const perfMatch = markdown.match(/\|\s*Performance\s*\|\s*(\d+)\/10\s*\|\s*(.*?)\s*\|/i)
  if (perfMatch) { scores.performance = parseInt(perfMatch[1]); scores.reasons.performance = perfMatch[2].trim(); hasScores = true }
  
  const secMatch = markdown.match(/\|\s*Security\s*\|\s*(\d+)\/10\s*\|\s*(.*?)\s*\|/i)
  if (secMatch) { scores.security = parseInt(secMatch[1]); scores.reasons.security = secMatch[2].trim(); hasScores = true }
  
  const bpMatch = markdown.match(/\|\s*Best Practices\s*\|\s*(\d+)\/10\s*\|\s*(.*?)\s*\|/i)
  if (bpMatch) { scores.bestPractices = parseInt(bpMatch[1]); scores.reasons.bestPractices = bpMatch[2].trim(); hasScores = true }
  
  return hasScores ? scores : null
}

export default function ReviewerPage({ onBack }: ReviewerPageProps) {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [reviewState, setReviewState] = useState<ReviewState>("idle")
  const [review, setReview] = useState("")
  const [error, setError] = useState("")

  const handleReview = useCallback(async () => {
    if (!code.trim()) return
    setReviewState("loading")
    setError("")
    setReview("")

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ""
      const response = await axios.post<string>(`${backendUrl}/ai/get-review`, {
        code,
        language,
      })
      const data = response.data
      setReview(typeof data === "string" ? data : JSON.stringify(data))
      setReviewState("success")
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.message as string | undefined) ?? err.message
        : "An unexpected error occurred."
      setError(msg)
      setReviewState("error")
    }
  }, [code, language])

  // Auto-detect language
  useEffect(() => {
    if (code.trim().length > 15) {
      const timeout = setTimeout(() => {
        const detected = hljs.highlightAuto(code, LANGUAGES.map(l => l.value))
        if (detected.language && detected.language !== language) {
          setLanguage(detected.language)
        }
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [code, language])

  // Keyboard shortcut Ctrl+Enter to trigger review
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (code.trim() && reviewState !== "loading") {
          handleReview();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReview, code, reviewState]);

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar with glowing purple bottom border */}
      <header className="flex shrink-0 items-center justify-between border-b border-brand/30 shadow-[0_1px_15px_rgba(168,85,247,0.15)] bg-[oklch(0.125_0.03_265)] px-4 py-2.5 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-2">
            <Code2 className="size-4 text-brand-light" />
            <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>CodeSensei</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Connected
          </div>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-8 w-[140px] border-white/10 bg-white/5 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="text-xs">
                  <span className="mr-2">{lang.icon}</span>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {/* Left: Code Editor Panel */}
          <Panel defaultSize={50} minSize={20} className="flex flex-col">
            {/* Panel header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/8 bg-black/10 px-4 py-2.5">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand" />
                  <span className="text-xs font-semibold text-foreground">Code Editor</span>
                </div>
                <span className="text-[11px] text-muted-foreground/60 mt-0.5">Paste your code and click Review →</span>
              </div>
              
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-green-500" />
                {LANGUAGES.find(l => l.value === language)?.label}
              </div>
            </div>

            {/* Editor with scanline texture */}
            <div className="flex-1 overflow-auto bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)]" style={{ backgroundSize: '100% 4px' }}>
              <div className="flex min-h-full">
                {/* Line numbers */}
                <div className="w-[40px] shrink-0 border-r border-white/5 bg-black/20 pt-4 text-right font-mono text-[13px] leading-[1.6] text-[#5a6285] select-none pr-3">
                  {(code.match(/\\n/g) || []).length === 0 && code.length === 0
                    ? <div>1</div>
                    : code.split('\\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>

                {/* Code Editor */}
                <div className="flex-1 relative">
                  {code.length === 0 && (
                    <div className="pointer-events-none absolute left-4 top-4 font-mono text-[13px] leading-[1.6] text-[#ffffff15] whitespace-pre">
{`// Paste your code here...
// Example:
async function fetchUser(id) {
  const res = await fetch('/api/' + id)
  return res.json()  // bug: missing await
}`}
                    </div>
                  )}
                  <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={(val) => highlightCode(val, language)}
                    padding={16}
                    style={{
                      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                      fontSize: 13,
                      lineHeight: "1.6",
                      minHeight: "100%",
                      background: "transparent",
                      color: "oklch(0.85 0.025 265)",
                    }}
                    className="min-h-full w-full outline-none"
                    textareaClassName="outline-none focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="flex shrink-0 items-center justify-between border-t border-white/8 bg-[oklch(0.125_0.03_265)] px-4 py-2.5">
              <span className="text-xs text-muted-foreground/60">{code.length} chars</span>
              
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[11px] text-muted-foreground/50">or Ctrl+Enter</span>
                <Button
                  onClick={handleReview}
                  disabled={reviewState === "loading" || !code.trim()}
                  size="sm"
                  className="bg-brand text-primary-foreground hover:bg-brand-light gap-1.5 font-medium disabled:opacity-50"
                >
                  {reviewState === "loading" ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      <Zap className="size-3.5" />
                      Review Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Panel>

          {/* Draggable Resizer */}
          <PanelResizeHandle className="relative flex w-2 items-center justify-center bg-transparent group cursor-col-resize">
            <div className="absolute inset-y-0 w-0.5 bg-white/5 transition-colors group-hover:bg-brand/50 group-active:bg-brand" />
            <div className="h-8 w-1 rounded-full bg-white/20 transition-colors group-hover:bg-brand-light z-10" />
          </PanelResizeHandle>

          {/* Right: Review Output Panel */}
          <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[oklch(0.10_0.03_265)]">
            {/* Panel header */}
            <div className="flex shrink-0 items-center border-b border-white/8 bg-black/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-400" />
                <span className="text-xs font-semibold text-foreground">Review Output</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-5">
              {reviewState === "idle" && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5 shadow-inner">
                    <Code2 className="size-8 text-muted-foreground/40" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground/80">Ready to review your code</h3>
                    <p className="mt-1 text-sm text-muted-foreground/60 max-w-[250px] mx-auto">
                      Paste any code on the left and click the Review button below
                    </p>
                  </div>
                  
                  <div className="mt-4 flex flex-col items-start gap-2 text-sm text-muted-foreground/50 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2"><Check className="size-4 text-green-500/50" /> Bugs & logic errors</div>
                    <div className="flex items-center gap-2"><Check className="size-4 text-green-500/50" /> Security vulnerabilities</div>
                    <div className="flex items-center gap-2"><Check className="size-4 text-green-500/50" /> Performance issues</div>
                    <div className="flex items-center gap-2"><Check className="size-4 text-green-500/50" /> Best practices & clean code</div>
                  </div>
                </div>
              )}

              {reviewState === "loading" && (
                <div className="flex h-full flex-col gap-6 p-2">
                  {/* Typing indicator header */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10 ring-1 ring-brand/30">
                      <Loader2 className="size-4 animate-spin text-brand-light" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">CodeSensei is analyzing…</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="loading-dot" />
                        <span className="loading-dot" />
                        <span className="loading-dot" />
                      </div>
                    </div>
                  </div>

                  {/* Fake streaming preview */}
                  <div className="typing-preview review-output space-y-3">
                    <div className="typing-line" style={{ animationDelay: "0s" }}>
                      <p className="text-sm text-muted-foreground/40">## 🔍 Code Review Summary</p>
                    </div>
                    <div className="typing-line" style={{ animationDelay: "0.3s" }}>
                      <p className="text-sm text-muted-foreground/30">Analyzing code structure and patterns...</p>
                    </div>
                    <div className="typing-line" style={{ animationDelay: "0.6s" }}>
                      <p className="text-sm text-muted-foreground/20">Checking for security vulnerabilities...</p>
                    </div>
                    <div className="typing-line" style={{ animationDelay: "0.9s" }}>
                      <p className="text-sm text-muted-foreground/15">Evaluating performance bottlenecks...</p>
                    </div>
                    <div className="typing-line" style={{ animationDelay: "1.2s" }}>
                      <p className="text-sm text-muted-foreground/10">Generating best practice suggestions...</p>
                    </div>
                  </div>
                </div>
              )}

              {reviewState === "error" && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">Review failed</p>
                    <p className="mt-1 text-xs text-muted-foreground">{error}</p>
                  </div>
                </div>
              )}

              {reviewState === "success" && review && (
                <div className="review-output">
                  <div className="mb-6 flex items-center justify-between rounded-lg border border-brand/20 bg-brand/5 px-3 py-2 text-xs text-brand-light">
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5" />
                      <span>Review complete · {LANGUAGES.find(l => l.value === language)?.label}</span>
                    </div>
                    <span className="text-brand-light/60">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>

                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      pre({ children }) {
                        return (
                          <div className="relative group">
                            <CopyCodeButton>{children}</CopyCodeButton>
                            <pre>{children}</pre>
                          </div>
                        )
                      },
                    }}
                  >
                    {review.replace(/## 📊 Score[\s\S]*?(?=(##|$))/i, "").trim()}
                  </ReactMarkdown>

                  {extractScores(review) && (
                    <div className="mt-8">
                      <ScoreDashboard data={extractScores(review)!} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
