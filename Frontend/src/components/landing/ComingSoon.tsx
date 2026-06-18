const COMING_SOON = [
  {
    icon: "🧠",
    title: "RAG-Powered Deep Review",
    description:
      "Advanced review mode that grounds every suggestion in real coding standards, OWASP security docs, and language-specific best practices — using retrieval-augmented generation (RAG) + LLM pipeline. Not just AI guessing, but AI that knows the rules.",
  },
  {
    icon: "💬",
    title: "Chat with your code",
    description:
      'Ask follow-up questions about your review. "Why is this a bug?" "Show me a fixed version." Conversational AI on top of your codebase.',
  },
  {
    icon: "📁",
    title: "File & repo upload",
    description:
      "Upload an entire file or connect your GitHub repo. Review multiple files at once, not just snippets.",
  },
  {
    icon: "📊",
    title: "Review history",
    description:
      "Save and revisit all your past reviews. Track improvements over time across projects.",
  },
  {
    icon: "🔗",
    title: "Shareable review links",
    description:
      "Generate a public link to any review result. Share with teammates or add to pull requests.",
  },
  {
    icon: "🧩",
    title: "VS Code extension",
    description:
      "Get CodeSensei reviews directly inside your editor. No tab switching, just instant inline feedback.",
  },
]

export function ComingSoon() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-light">
            What's coming
          </p>
          <h2 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            The future of CodeSensei
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            We're building more powerful tools on top of the core reviewer. Here's what's next.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_SOON.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl border border-white/8 bg-card p-6 transition-all duration-300 hover:border-brand/30"
            >
              {/* Coming Soon badge */}
              <div className="absolute right-3 top-3">
                <span className="rounded-full border border-[oklch(0.65_0.18_300/30%)] bg-[oklch(0.65_0.18_300/10%)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[oklch(0.75_0.18_300)]">
                  Coming Soon
                </span>
              </div>

              {/* Hover glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, oklch(0.65 0.18 300 / 6%) 0%, transparent 60%)",
                }}
              />

              <div className="relative">
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-2xl">
                  {item.icon}
                </div>
                <h3 className="mb-2 pr-20 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
