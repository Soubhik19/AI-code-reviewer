import { useRef, useCallback } from "react"

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

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty("--spotlight-x", `${x}px`)
    card.style.setProperty("--spotlight-y", `${y}px`)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="spotlight-card group relative overflow-hidden rounded-xl border border-white/8 bg-card p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
    >
      {/* Spotlight effect */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(250px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), oklch(0.55 0.22 265 / 12%) 0%, transparent 100%)",
        }}
      />
      {children}
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="scroll-reveal px-4 py-24 sm:px-6 lg:px-8">
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
          {FEATURES.map((feature, i) => (
            <SpotlightCard key={feature.title}>
              <div className="relative scroll-reveal-card" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
