'use client'

import { useEffect, useRef } from 'react'

export function WarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frame = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const NUM_LINES = 120
    const SPEED = 0.006

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const maxDist = Math.sqrt(cx * cx + cy * cy) * 1.4

      for (let i = 0; i < NUM_LINES; i++) {
        const angle = (i / NUM_LINES) * Math.PI * 2
        const offset = i / NUM_LINES

        // Each line has its own progress through the warp cycle
        const progress = ((frame * SPEED + offset) % 1)

        // Lines start near center, race to edge
        const startPct = Math.max(0, progress - 0.08)
        const endPct = progress
        const startDist = startPct * maxDist
        const endDist = endPct * maxDist

        // Fade in slowly, then fade out quickly near the edge
        const opacity = progress < 0.15
          ? (progress / 0.15) * 0.35
          : progress > 0.85
            ? ((1 - progress) / 0.15) * 0.35
            : 0.35

        // Color shifts from purple to blue as line races outward
        const hue = 270 - progress * 60 // 270=purple → 210=blue
        const saturation = 80 + progress * 20

        ctx.beginPath()
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, 70%, ${opacity})`
        ctx.lineWidth = 0.6 + progress * 0.4
        ctx.moveTo(cx + Math.cos(angle) * startDist, cy + Math.sin(angle) * startDist)
        ctx.lineTo(cx + Math.cos(angle) * endDist, cy + Math.sin(angle) * endDist)
        ctx.stroke()
      }

      // Central glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80)
      glow.addColorStop(0, 'rgba(153, 69, 255, 0.15)')
      glow.addColorStop(0.5, 'rgba(0, 194, 255, 0.05)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, 80, 0, Math.PI * 2)
      ctx.fill()

      frame++
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}
