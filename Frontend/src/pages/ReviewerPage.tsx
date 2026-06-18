import { useState, useCallback, type ReactNode } from "react"
import axios from "axios"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "prismjs/themes/prism-tomorrow.css"
import "highlight.js/styles/github-dark.css"

import {
  ArrowLeft,
  Code2,
  Copy,
  Check,
  ClipboardList,
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
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
]

const DEFAULT_CODE = `async function fetchUser(id) {
  const res = await fetch('/api/users/' + id);
  const data = res.json(); // missing await

  if (data.role == 'admin') { // loose equality
    return data;
  }

  // security: password exposed
  return { user: data.name, pwd: data.password };
}`

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
  if (typeof node === "object" && "props" in node) {
    return extractText((node as React.ReactElement).props.children)
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

export default function ReviewerPage({ onBack }: ReviewerPageProps) {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(DEFAULT_CODE)
  const [reviewState, setReviewState] = useState<ReviewState>("idle")
  const [review, setReview] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleReview = useCallback(async () => {
    if (!code.trim()) return
    setReviewState("loading")
    setError("")
    setReview("")

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ""
      const response = await axios.post<string>(`${backendUrl}/ai/get-review`, {
        language,
        code,
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

  const handleCopy = useCallback(async () => {
    if (!review) return
    // Extract only the refactored code block from ## 🚀 Refactored Code section
    const refactoredMatch = review.match(
      /##\s*🚀\s*Refactored Code[\s\S]*?```[\w]*\n([\s\S]*?)```/
    )
    const textToCopy = refactoredMatch ? refactoredMatch[1].trim() : review
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [review])

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="flex shrink-0 items-center justify-between border-b border-white/8 bg-[oklch(0.125_0.03_265)] px-4 py-2.5">
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

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="h-8 w-36 border-white/10 bg-white/5 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} className="text-xs">
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left: Code Editor */}
        <div className="flex flex-col border-r border-white/8 md:w-1/2">
          {/* Panel header */}
          <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-4 py-2.5">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-xs font-medium text-muted-foreground">Code Editor</span>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-auto">
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

          {/* Footer bar */}
          <div className="flex shrink-0 items-center justify-between border-t border-white/8 bg-[oklch(0.125_0.03_265)] px-4 py-2.5">
            <span className="text-xs text-muted-foreground/60">{code.length} chars</span>
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

        {/* Right: Review Output */}
        <div className="flex flex-col md:w-1/2">
          {/* Panel header */}
          <div className="flex shrink-0 items-center border-b border-white/8 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-muted-foreground">Review</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-5">
            {reviewState === "idle" && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-xl border border-white/8 bg-white/4">
                  <ClipboardList className="size-6 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    Your review will appear here
                  </p>
                  <p className="text-xs text-muted-foreground/50">
                    Paste your code on the left and click Review Code
                  </p>
                </div>
              </div>
            )}

            {reviewState === "loading" && (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="flex gap-2">
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                </div>
                <p className="text-sm text-muted-foreground">Analyzing your code…</p>
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
                >{review}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
