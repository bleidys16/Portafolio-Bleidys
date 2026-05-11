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
  { name: 'React', slug: 'react', color: '61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
  { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
  { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E' },
  { name: 'HTML5', slug: 'html5', color: 'E34F26' },
  { name: 'CSS3', slug: 'css3', color: '1572B6' },
  { name: 'Git', slug: 'git', color: 'F05032' },
  { name: 'MongoDB', slug: 'mongodb', color: '47A248' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1' },
  { name: 'Tailwind', slug: 'tailwindcss', color: '06B6D4' },
  { name: 'Figma', slug: 'figma', color: 'F24E1E' },
  { name: 'Python', slug: 'python', color: '3776AB' },
  { name: 'Expo', slug: 'expo', color: 'FFFFFF' },
]

export default function TechGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const techPositionsRef = useRef<{ tech: Tech, lng: number, lat: number }[]>([])

  // Interaction and Rotation Refs
  const rotationRef = useRef<[number, number]>([0, -25])
  const velocityRef = useRef<[number, number]>([0.35, 0]) // [target_speed, current_momentum]
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef<[number, number] | null>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Preload tech icons
    TECHS.forEach(tech => {
      if (!imagesRef.current.has(tech.slug)) {
        const img = new Image()
        // Use a more robust URL format
        const color = tech.color === 'FFFFFF' ? 'white' : tech.color
        img.src = `https://cdn.simpleicons.org/${tech.slug}/${color}`
        img.crossOrigin = 'anonymous'
        img.onload = () => imagesRef.current.set(tech.slug, img)
        img.onerror = () => console.warn(`Failed to load icon for ${tech.slug}`)
      }
    })

    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = 500
    const radius = Math.min(width, height) / 3 // Slightly smaller as requested

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.scale(dpr, dpr)

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

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

    const generateDotsInPolygon = (feature: any, dotSpacing = 28) => { 
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.18 

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          if (pointInFeature([lng, lat], feature)) dots.push([lng, lat])
        }
      }
      return dots
    }

    interface DotData { lng: number; lat: number }
    const allDots: DotData[] = []
    let landFeatures: any

    const render = () => {
      if (!context) return
      context.clearRect(0, 0, width, height)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Draw background globe
      context.beginPath()
      context.arc(width / 2, height / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "#000000"
      context.fill()

      // Subtle purple glow for the globe border
      context.strokeStyle = "rgba(168, 85, 247, 0.3)"
      context.lineWidth = 1 * scaleFactor
      context.stroke()

      // Draw land-based dots (The halftone dots)
      context.fillStyle = "rgba(168, 85, 247, 0.35)"
      allDots.forEach((dot) => {
        const projected = projection([dot.lng, dot.lat])
        if (projected) {
          context.beginPath()
          context.arc(projected[0], projected[1], 0.8 * scaleFactor, 0, 2 * Math.PI)
          context.fill()
        }
      })

      // DRAW TECH ICONS ON GLOBE SURFACE
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

      techPositionsRef.current.forEach(({ tech, lng, lat }) => {
        const projected = projection([lng, lat])
        
        if (projected) {
          const [px, py] = projected
          const img = imagesRef.current.get(tech.slug)
          
          if (img) {
            const dx = px - width / 2
            const dy = py - height / 2
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            const edgeFade = Math.pow(Math.max(0, 1 - (dist / currentScale)), 1.5)
            const alpha = edgeFade * 1.5
            
            if (alpha > 0.1) {
              const depthFactor = 0.97
              const sx = width / 2 + dx * depthFactor
              const sy = height / 2 + dy * depthFactor
              
              const size = 52 * scaleFactor * (0.7 + alpha * 0.3)

              context.save()
              context.globalAlpha = Math.min(1, alpha)

              context.beginPath()
              context.arc(sx, sy, size * 0.6, 0, 2 * Math.PI)
              const r = parseInt(tech.color.slice(0, 2), 16) || 168
              const g = parseInt(tech.color.slice(2, 4), 16) || 85
              const b = parseInt(tech.color.slice(4, 6), 16) || 247
              
              const gradient = context.createRadialGradient(sx, sy, 0, sx, sy, size * 0.6)
              gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`)
              gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
              context.fillStyle = gradient
              context.fill()

              context.drawImage(img, sx - size / 2, sy - size / 2, size, size)

              if (alpha > 0.6) {
                context.fillStyle = "white"
                context.font = `500 ${Math.round(10 * scaleFactor)}px var(--font-body)`
                context.textAlign = "center"
                context.shadowColor = "rgba(0,0,0,0.5)"
                context.shadowBlur = 4
                context.fillText(tech.name, sx, sy + size * 0.85)
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
        landFeatures = await response.json()
        landFeatures.features.forEach((feature: any) => {
          generateDotsInPolygon(feature, 22).forEach(([lng, lat]) => {
            allDots.push({ lng, lat })
          })
        })
        setIsLoading(false)
        render()
      } catch (err) {
        setError("Error loading world data")
        setIsLoading(false)
      }
    }

    const rotateTimer = d3.timer(() => {
      if (!isDraggingRef.current) {
        const targetSpeed = isHoveredRef.current ? 0.05 : 0.3
        
        velocityRef.current[0] += (targetSpeed - velocityRef.current[0]) * 0.03 // Smoother transition
        velocityRef.current[1] *= 0.96 // Smoother friction
        
        rotationRef.current[0] += velocityRef.current[0] + velocityRef.current[1]
        projection.rotate(rotationRef.current)
      }
      render()
    })

    // Drag Interaction Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      lastMousePosRef.current = [e.clientX, e.clientY]
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !lastMousePosRef.current) return
      
      const dx = e.clientX - lastMousePosRef.current[0]
      const dy = e.clientY - lastMousePosRef.current[1]
      
      // Update rotation
      rotationRef.current[0] += dx * 0.3
      rotationRef.current[1] -= dy * 0.3
      
      // Keep tilt within reasonable bounds
      rotationRef.current[1] = Math.max(-45, Math.min(45, rotationRef.current[1]))
      
      // Store momentum
      velocityRef.current[1] = dx * 0.5
      
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

    canvas.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseenter", handleMouseEnter)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    loadWorldData()

    return () => {
      rotateTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseenter", handleMouseEnter)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.globeContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {isLoading && <div className={styles.loading}>Cargando Mundo...</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
