import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onStartReviewing: () => void
}

function CSLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="navbar-cs-logo">
      <rect width="36" height="36" rx="8" fill="oklch(0.15 0.04 265)" stroke="oklch(0.55 0.22 265 / 30%)" strokeWidth="1"/>
      <text x="18" y="24" textAnchor="middle" fontFamily="'Plus Jakarta Sans', monospace" fontWeight="800" fontSize="16" fill="#6c63ff">CS</text>
      <circle cx="30" cy="6" r="2.5" fill="#6c63ff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

export function Navbar({ onStartReviewing }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-all duration-300 ${
      scrolled
        ? "bg-[oklch(0.105_0.025_265/92%)] backdrop-blur-2xl"
        : "bg-[oklch(0.105_0.025_265/85%)] backdrop-blur-xl"
    }`}>
      {/* Glowing purple bottom line */}
      <div className="navbar-glow-line" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <CSLogo />
          <span className="text-lg font-semibold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            CodeSensei
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a
            href="https://github.com/Soubhik19/AI-code-reviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Button
            onClick={onStartReviewing}
            className="bg-brand text-primary-foreground hover:bg-brand-light gap-1.5 font-medium transition-all"
          >
            Start Reviewing
            <span aria-hidden>→</span>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[oklch(0.125_0.03_265)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              How it works
            </a>
            <a
              href="https://github.com/Soubhik19/AI-code-reviewer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              GitHub
            </a>
            <Button
              onClick={() => { onStartReviewing(); setMobileOpen(false) }}
              className="mt-1 bg-brand text-primary-foreground hover:bg-brand-light w-full font-medium"
            >
              Start Reviewing →
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
