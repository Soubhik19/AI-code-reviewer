import { useEffect, useRef } from "react"

const COLORS = [
  "oklch(0.65 0.22 265)",  // purple
  "oklch(0.62 0.18 240)",  // blue
  "oklch(0.72 0.2 330)",   // pink
  "oklch(0.78 0.18 80)",   // yellow
  "oklch(0.65 0.22 25)",   // red-orange
  "oklch(0.68 0.2 50)",    // orange
]

const PARTICLE_COUNT = 1000;
const RING_RADIUS = 380;
const REPULSION_RADIUS = 150;
const RETURN_SPEED = 0.04;

interface Particle {
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
  radius: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight

    const mouse = { x: -1000, y: -1000 }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    handleResize()

    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radiusOffset = (Math.random() - 0.5) * 80
      const startRadius = RING_RADIUS + radiusOffset
      
      particles.push({
        x: width / 2 + Math.cos(angle) * startRadius,
        y: height / 2 + Math.sin(angle) * startRadius,
        angle: angle,
        speed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        radius: Math.random() * 1.5 + 1.0,
        wobbleSpeed: Math.random() * 1.5 + 0.5,
        wobbleAmp: Math.random() * 40,
        wobbleOffset: Math.random() * Math.PI * 2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const time = performance.now() * 0.001

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.angle += p.speed

        // Calculate natural orbit position
        const currentRadius = RING_RADIUS + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp
        const targetX = centerX + Math.cos(p.angle) * currentRadius
        const targetY = centerY + Math.sin(p.angle) * currentRadius

        // Float towards target
        p.x += (targetX - p.x) * RETURN_SPEED
        p.y += (targetY - p.y) * RETURN_SPEED

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS
          p.x += (dx / dist) * force * 15
          p.y += (dy / dist) * force * 15
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        // Add a subtle glow
        ctx.shadowColor = p.color
        ctx.shadowBlur = 4
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
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
