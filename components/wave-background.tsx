"use client"

import { useEffect, useRef } from "react"

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Wave properties
    const waves = [
      { y: canvas.height * 0.3, amplitude: 20, frequency: 0.02, speed: 0.05, color: "rgba(139, 92, 246, 0.2)" },
      { y: canvas.height * 0.5, amplitude: 30, frequency: 0.01, speed: 0.03, color: "rgba(79, 70, 229, 0.2)" },
      { y: canvas.height * 0.7, amplitude: 15, frequency: 0.03, speed: 0.07, color: "rgba(99, 102, 241, 0.2)" },
    ]

    let time = 0

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f172a") // Dark blue
      gradient.addColorStop(1, "#1e1b4b") // Dark indigo
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw waves
      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.moveTo(0, wave.y)

        for (let x = 0; x < canvas.width; x++) {
          const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        ctx.fillStyle = wave.color
        ctx.fill()
      })

      time += 0.05
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" aria-hidden="true" />
}
