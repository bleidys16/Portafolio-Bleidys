'use client'

import { useEffect, useState } from 'react'
import styles from './CustomCursor.module.css'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setPosition({ x: clientX, y: clientY })
      if (!isVisible) setIsVisible(true)
      
      // Update background glow position
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`)
      
      const target = e.target as HTMLElement
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer' || target.tagName === 'A' || target.tagName === 'BUTTON')
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseleave', onMouseLeave)
    document.body.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseleave', onMouseLeave)
      document.body.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [isVisible])

  if (!mounted) return null

  return (
    <>
      <div
        className={`${styles.cursor} ${isPointer ? styles.pointer : ''} ${!isVisible ? styles.hidden : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      <div
        className={`${styles.cursorFollower} ${isPointer ? styles.pointerFollower : ''} ${!isVisible ? styles.hidden : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  )
}
