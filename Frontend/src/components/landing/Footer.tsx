import { Code2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Left: brand */}
          <div className="max-w-xs">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10 ring-1 ring-brand/30">
                <Code2 className="size-3.5 text-brand-light" />
              </div>
              <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>CodeSensei</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              AI-powered code reviews for developers who care about quality.
            </p>
          </div>

          {/* Right: links */}
          <div className="flex gap-12">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Project
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://github.com/Soubhik19/AI-code-reviewer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  CodeSensei — AI Code Reviewer
                </a>
                <a
                  href="https://github.com/Soubhik19/AI-code-reviewer/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Report a bug
                </a>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Tech
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">React</span>
                <span className="text-sm text-muted-foreground">Express.js</span>
                <span className="text-sm text-muted-foreground">Gemini 2.0 Flash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            Built by Soubhik — CodeSensei is open source and free to use.
          </p>
        </div>
      </div>
    </footer>
  )
}
