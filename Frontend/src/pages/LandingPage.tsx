import { useEffect, useRef } from "react"
import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { StatsBar } from "@/components/landing/StatsBar"
import { Features } from "@/components/landing/Features"
import { ComingSoon } from "@/components/landing/ComingSoon"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"

interface LandingPageProps {
  onStartReviewing: () => void
}

export default function LandingPage({ onStartReviewing }: LandingPageProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll reveal via Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )

    document.querySelectorAll(".scroll-reveal, .scroll-reveal-card").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Custom cursor glow (desktop only)
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15
      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground noise-bg">
      {/* Custom cursor glow */}
      <div ref={cursorRef} className="cursor-glow" />

      <Navbar onStartReviewing={onStartReviewing} />
      <main>
        <Hero onStartReviewing={onStartReviewing} />
        <StatsBar />
        <Features />
        <ComingSoon />
        <HowItWorks />
        <CTA onStartReviewing={onStartReviewing} />
      </main>
      <Footer />
    </div>
  )
}
