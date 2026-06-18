import { useEffect, useRef, useState } from "react"

const STATS = [
  { value: 10, suffix: "+", label: "Languages supported" },
  { value: 3, prefix: "< ", suffix: "s", label: "Average review time" },
  { value: 100, suffix: "%", label: "Free to use" },
]

function useCountUp(target: number, isVisible: boolean, duration = 1500) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isVisible || hasRun.current) return
    hasRun.current = true

    const steps = 40
    const increment = target / steps
    const interval = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [target, isVisible, duration])

  return count
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="stats-bar">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-4 py-5 sm:flex-row sm:gap-0">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1 px-8 sm:px-12">
              <span className="text-3xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                {stat.prefix ?? ""}
                <CountDisplay target={stat.value} visible={visible} />
                {stat.suffix}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
            </div>
            {i < STATS.length - 1 && (
              <div className="hidden h-10 w-px bg-white/10 sm:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function CountDisplay({ target, visible }: { target: number; visible: boolean }) {
  const count = useCountUp(target, visible)
  return <>{count}</>
}
