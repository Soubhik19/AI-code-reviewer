const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Review",
    description:
      "Paste any code and get a full senior-level review in seconds. Powered by Gemini 2.0 Flash.",
  },
  {
    icon: "🔍",
    title: "Bug Detection",
    description:
      "Catches logic errors, null pointer risks, async mistakes, and edge cases before they reach production.",
  },
  {
    icon: "🔒",
    title: "Security Scanning",
    description:
      "Identifies SQL injection, XSS, CSRF, and other OWASP Top 10 vulnerabilities automatically.",
  },
  {
    icon: "📐",
    title: "Best Practices",
    description:
      "SOLID, DRY, clean code. Your reviewer has 7+ years of senior engineering experience baked in.",
  },
  {
    icon: "🚀",
    title: "Performance Tips",
    description:
      "Spots bottlenecks, memory leaks, and redundant computations with clear suggested fixes.",
  },
  {
    icon: "🌐",
    title: "Multi-language",
    description:
      "JavaScript, Python, TypeScript, Go, Java, Rust, C++ — all supported out of the box.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-light">
            What it catches
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Everything a senior dev would flag
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border border-white/8 bg-card p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, oklch(0.55 0.22 265 / 8%) 0%, transparent 60%)",
                }}
              />

              <div className="relative">
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
