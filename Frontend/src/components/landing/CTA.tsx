import { Button } from "@/components/ui/button"

interface CTAProps {
  onStartReviewing: () => void
}

export function CTA({ onStartReviewing }: CTAProps) {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.22 265 / 15%) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Ready to write better code?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Free to use. No sign-up required. Just paste your code and get results.
        </p>
        <Button
          size="lg"
          onClick={onStartReviewing}
          className="bg-brand text-primary-foreground hover:bg-brand-light gap-2 px-8 text-base font-semibold transition-all hover:scale-105"
        >
          Start reviewing for free →
        </Button>
      </div>
    </section>
  )
}
