const STEPS = [
  {
    number: "01",
    title: "Paste your code",
    description: "Drop any snippet into the editor — functions, classes, entire files.",
  },
  {
    number: "02",
    title: "Choose your language",
    description: "Select from JavaScript, Python, TypeScript, Go, Java, Rust, C++, and more.",
  },
  {
    number: "03",
    title: "Get your review",
    description: "Receive bugs, fixes, and explanations — all in seconds, powered by Gemini 2.0.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-light">
            Three steps
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            From code to review in seconds
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px md:block"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, oklch(0.55 0.22 265 / 30%) 20%, oklch(0.55 0.22 265 / 30%) 80%, transparent 100%)",
            }}
          />

          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-4 text-center md:items-center">
              {/* Number circle */}
              <div className="relative flex size-12 items-center justify-center rounded-full border border-brand/30 bg-brand/10 font-mono text-sm font-bold text-brand-light">
                {step.number}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 20px 0 oklch(0.55 0.22 265 / 25%)",
                  }}
                />
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
