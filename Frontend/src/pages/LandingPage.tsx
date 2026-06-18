import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { ComingSoon } from "@/components/landing/ComingSoon"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CTA } from "@/components/landing/CTA"
import { Footer } from "@/components/landing/Footer"

interface LandingPageProps {
  onStartReviewing: () => void
}

export default function LandingPage({ onStartReviewing }: LandingPageProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Navbar onStartReviewing={onStartReviewing} />
      <main>
        <Hero onStartReviewing={onStartReviewing} />
        <Features />
        <ComingSoon />
        <HowItWorks />
        <CTA onStartReviewing={onStartReviewing} />
      </main>
      <Footer />
    </div>
  )
}
