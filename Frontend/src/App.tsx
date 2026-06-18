import { useState } from "react"
import LandingPage from "@/pages/LandingPage"
import ReviewerPage from "@/pages/ReviewerPage"

export type Page = "landing" | "reviewer"

export function App() {
  const [page, setPage] = useState<Page>("landing")

  if (page === "reviewer") {
    return <ReviewerPage onBack={() => setPage("landing")} />
  }

  return <LandingPage onStartReviewing={() => setPage("reviewer")} />
}

export default App
