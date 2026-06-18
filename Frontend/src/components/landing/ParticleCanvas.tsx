import { useEffect, useRef } from "react"

const COLORS = [
  "oklch(0.65 0.22 265)",  // purple
  "oklch(0.62 0.18 240)",  // blue
  "oklch(0.72 0.2 330)",   // pink
  "oklch(0.78 0.18 80)",   // yellow
  "oklch(0.65 0.22 25)",   // red-orange
  "oklch(0.68 0.2 50)",    // orange
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  color: string
  angle: number
  rotSpeed: number
  alpha: number
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    w: Math.random() * 5 + 2,
    h: Math.random() * 2 + 1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    angle: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.015,
    alpha: Math.random() * 0.4 + 0.15,
  }
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const particles = useRef<Particle[]>([])
  const rafId = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      // Repopulate if empty or drastically resized
      const count = Math.floor((canvas.width * canvas.height) / 10000)
      particles.current = Array.from({ length: Math.min(count, 120) }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 }
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)

    const REPEL_RADIUS = 150
    const REPEL_STRENGTH = 1.0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles.current) {
        // Mouse repulsion
        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH
          // Direct position push for snappy magnetic feel
          p.x += (dx / dist) * force * 10
          p.y += (dy / dist) * force * 10
          // Also add some velocity so they drift away smoothly
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }

        // Dampen velocity
        p.vx *= 0.98
        p.vy *= 0.98

        // Keep a minimum drift
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed < 0.05) {
          p.vx += (Math.random() - 0.5) * 0.04
          p.vy += (Math.random() - 0.5) * 0.04
        }

        p.x += p.vx
        p.y += p.vy
        p.angle += p.rotSpeed

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        // Draw dash/rectangle
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 4
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      rafId.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId.current)
      ro.disconnect()
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  )
}
