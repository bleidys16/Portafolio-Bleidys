'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false)
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
        if (followerRef.current) followerRef.current.style.opacity = '1'
      }

      window.requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
        }
        if (followerRef.current) {
          followerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
        }
        // Update background glow position
        document.documentElement.style.setProperty('--mouse-x', `${clientX}px`)
        document.documentElement.style.setProperty('--mouse-y', `${clientY}px`)
      })

      const target = e.target as HTMLElement
      const isClickable = window.getComputedStyle(target).cursor === 'pointer' || 
                        target.tagName === 'A' || 
                        target.tagName === 'BUTTON' ||
                        target.closest('a') ||
                        target.closest('button')
      
      setIsPointer(!!isClickable)
    }

    const onMouseLeave = () => {
      isVisibleRef.current = false
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (followerRef.current) followerRef.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseleave', onMouseLeave)
    document.body.addEventListener('mouseenter', () => {
      isVisibleRef.current = true
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
      if (followerRef.current) followerRef.current.style.opacity = '1'
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${isPointer ? styles.pointer : ''}`}
        style={{ opacity: 0 }}
      />
      <div
        ref={followerRef}
        className={`${styles.cursorFollower} ${isPointer ? styles.pointerFollower : ''}`}
        style={{ opacity: 0 }}
      />
    </>
  )
}
