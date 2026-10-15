'use client'

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import styles from "./TechGlobe.module.css"

interface Tech {
  name: string
  slug: string
  color: string
}

const TECHS: Tech[] = [
  // Frontend
  { name: 'HTML5', slug: 'html5', color: 'E34F26' },
  { name: 'CSS3', slug: 'css', color: '1572B6' },
  { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
  { name: 'React', slug: 'react', color: '61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF' },
  { name: 'Angular', slug: 'angular', color: 'DD0031' },
  { name: 'Tailwind', slug: 'tailwindcss', color: '06B6D4' },
  { name: 'Bootstrap', slug: 'bootstrap', color: '7952B3' },
  { name: 'Vite', slug: 'vite', color: '646CFF' },
  { name: 'Flutter', slug: 'flutter', color: '02569B' },

  // Backend & Databases
  { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
  { name: 'Express', slug: 'express', color: 'FFFFFF' },
  { name: 'Python', slug: 'python', color: '3776AB' },
  { name: 'Django', slug: 'django', color: '092E20' },
  { name: 'Java', slug: 'openjdk', color: 'ED8B00' },
  { name: 'PHP', slug: 'php', color: '777BB4' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1' },
  { name: 'SQLite', slug: 'sqlite', color: '003B57' },
  { name: 'Supabase', slug: 'supabase', color: '3ECF8E' },

  // Cloud & DevOps & Tools
  { name: 'Git', slug: 'git', color: 'F05032' },
  { name: 'GitHub', slug: 'github', color: 'FFFFFF' },
  { name: 'Docker', slug: 'docker', color: '2496ED' },
  { name: 'Vercel', slug: 'vercel', color: 'FFFFFF' },
  { name: 'Figma', slug: 'figma', color: 'F24E1E' },
]

export default function TechGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const techPositionsRef = useRef<{ tech: Tech, lng: number, lat: number }[]>([])

  // Interaction and Rotation Refs
  const rotationRef = useRef<[number, number]>([0, -22])
  const velocityRef = useRef<[number, number]>([0.35, 0])
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef<[number, number] | null>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Preload tech icons with simpleicons
    TECHS.forEach(tech => {
      if (!imagesRef.current.has(tech.slug)) {
        const img = new Image()
        const color = tech.color === 'FFFFFF' ? 'white' : tech.color
        img.src = `https://cdn.simpleicons.org/${tech.slug}/${color}`
        img.crossOrigin = 'anonymous'
        img.onload = () => imagesRef.current.set(tech.slug, img)
        img.onerror = () => console.warn(`Failed to load icon for ${tech.slug}`)
      }
    })

    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = 520
    const radius = Math.min(width, height) / 2.9

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.scale(dpr, dpr)

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i], [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry
      if (geometry.type === "Polygon") {
        if (!pointInPolygon(point, geometry.coordinates[0])) return false
        for (let i = 1; i < geometry.coordinates.length; i++) {
          if (pointInPolygon(point, geometry.coordinates[i])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
      }
      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 26) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.20

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          if (pointInFeature([lng, lat], feature)) dots.push([lng, lat])
        }
      }
      return dots
    }

    interface DotData { lng: number; lat: number }
    const allDots: DotData[] = []

    // Even distribution of technologies across sphere via Fibonacci Spiral
    if (techPositionsRef.current.length === 0) {
      techPositionsRef.current = TECHS.map((tech, i) => {
        const phi = Math.acos(-1 + (2 * i) / TECHS.length)
        const theta = Math.sqrt(TECHS.length * Math.PI) * phi
        return {
          tech,
          lng: (theta * 180 / Math.PI) % 360 - 180,
          lat: 90 - (phi * 180 / Math.PI)
        }
      })
    }

    const render = () => {
      if (!context) return
      context.clearRect(0, 0, width, height)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius
      const cx = width / 2
      const cy = height / 2

      // 1. Base Globe Sphere (Plum Obsidian Gradient)
      context.beginPath()
      context.arc(cx, cy, currentScale, 0, 2 * Math.PI)
      const globeGrad = context.createRadialGradient(
        cx - currentScale * 0.25,
        cy - currentScale * 0.25,
        currentScale * 0.1,
        cx,
        cy,
        currentScale
      )
      globeGrad.addColorStop(0, "#3a2540")
      globeGrad.addColorStop(0.45, "#251829")
      globeGrad.addColorStop(0.8, "#151217")
      globeGrad.addColorStop(1, "#0d0a0f")
      context.fillStyle = globeGrad
      context.fill()

      // 2. Crisp perimeter edge without halo
      context.strokeStyle = "rgba(232, 169, 196, 0.15)"
      context.lineWidth = 1 * scaleFactor
      context.stroke()

      // 4. Optimized Land Dots Rendering (Single batch draw call!)
      if (allDots.length > 0) {
        context.beginPath()
        const dotR = 0.95 * scaleFactor
        for (let i = 0; i < allDots.length; i++) {
          const projected = projection([allDots[i].lng, allDots[i].lat])
          if (projected) {
            context.moveTo(projected[0] + dotR, projected[1])
            context.arc(projected[0], projected[1], dotR, 0, 2 * Math.PI)
          }
        }
        context.fillStyle = "rgba(185, 160, 201, 0.42)" // Soft lilac halftone
        context.fill()
      }

      // 5. Draw Tech Icons & Labels
      techPositionsRef.current.forEach(({ tech, lng, lat }) => {
        const projected = projection([lng, lat])

        if (projected) {
          const [px, py] = projected
          const img = imagesRef.current.get(tech.slug)

          if (img) {
            const dx = px - cx
            const dy = py - cy
            const dist = Math.sqrt(dx * dx + dy * dy)

            const edgeFade = Math.pow(Math.max(0, 1 - (dist / currentScale)), 1.4)
            const alpha = edgeFade * 1.5

            if (alpha > 0.1) {
              const depthFactor = 0.97
              const sx = cx + dx * depthFactor
              const sy = cy + dy * depthFactor

              const size = 42 * scaleFactor * (0.75 + alpha * 0.25)

              context.save()
              context.globalAlpha = Math.min(1, alpha)

              // Icon ambient glow badge
              context.beginPath()
              context.arc(sx, sy, size * 0.65, 0, 2 * Math.PI)
              const r = parseInt(tech.color.slice(0, 2), 16) || 232
              const g = parseInt(tech.color.slice(2, 4), 16) || 169
              const b = parseInt(tech.color.slice(4, 6), 16) || 196

              const gradient = context.createRadialGradient(sx, sy, 0, sx, sy, size * 0.65)
              gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.28)`)
              gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
              context.fillStyle = gradient
              context.fill()

              // Draw image
              context.drawImage(img, sx - size / 2, sy - size / 2, size, size)

              // Draw label on near icons
              if (alpha > 0.65) {
                context.fillStyle = "#F7F4F5"
                context.font = `600 ${Math.round(10.5 * scaleFactor)}px var(--font-body)`
                context.textAlign = "center"
                context.shadowColor = "rgba(0, 0, 0, 0.85)"
                context.shadowBlur = 4
                context.fillText(tech.name, sx, sy + size * 0.78)
              }

              context.restore()
            }
          }
        }
      })
    }

    const loadWorldData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json")
        if (!response.ok) throw new Error("Failed load")
        const landFeatures = await response.json()
        landFeatures.features.forEach((feature: any) => {
          generateDotsInPolygon(feature, 24).forEach(([lng, lat]) => {
            allDots.push({ lng, lat })
          })
        })
        setIsLoading(false)
        render()
      } catch (err) {
        setError("Error cargando mapa")
        setIsLoading(false)
      }
    }

    const rotateTimer = d3.timer(() => {
      if (!isDraggingRef.current) {
        const targetSpeed = isHoveredRef.current ? 0.08 : 0.32
        velocityRef.current[0] += (targetSpeed - velocityRef.current[0]) * 0.04
        velocityRef.current[1] *= 0.95

        rotationRef.current[0] += velocityRef.current[0] + velocityRef.current[1]
        projection.rotate(rotationRef.current)
      }
      render()
    })

    // Drag Interaction Handlers (Mouse & Touch)
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      lastMousePosRef.current = [e.clientX, e.clientY]
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !lastMousePosRef.current) return

      const dx = e.clientX - lastMousePosRef.current[0]
      const dy = e.clientY - lastMousePosRef.current[1]

      rotationRef.current[0] += dx * 0.32
      rotationRef.current[1] -= dy * 0.32
      rotationRef.current[1] = Math.max(-45, Math.min(45, rotationRef.current[1]))
      velocityRef.current[1] = dx * 0.4

      lastMousePosRef.current = [e.clientX, e.clientY]
      projection.rotate(rotationRef.current)
      render()
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      lastMousePosRef.current = null
    }

    const handleMouseEnter = () => { isHoveredRef.current = true }
    const handleMouseLeave = () => { isHoveredRef.current = false; isDraggingRef.current = false }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true
        lastMousePosRef.current = [e.touches[0].clientX, e.touches[0].clientY]
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !lastMousePosRef.current || e.touches.length !== 1) return
      const dx = e.touches[0].clientX - lastMousePosRef.current[0]
      const dy = e.touches[0].clientY - lastMousePosRef.current[1]

      rotationRef.current[0] += dx * 0.32
      rotationRef.current[1] -= dy * 0.32
      rotationRef.current[1] = Math.max(-45, Math.min(45, rotationRef.current[1]))
      velocityRef.current[1] = dx * 0.4

      lastMousePosRef.current = [e.touches[0].clientX, e.touches[0].clientY]
      projection.rotate(rotationRef.current)
      render()
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      lastMousePosRef.current = null
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    loadWorldData()

    return () => {
      rotateTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.globeContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {isLoading && <div className={styles.loading}>Cargando Mapa...</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
