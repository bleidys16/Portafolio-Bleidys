'use client'

import { useEffect, useRef, useState } from 'react'
import { useCvModal } from '@/context/CvModalContext'
import styles from './CustomCursor.module.css'

export function CustomCursor() {
  const { isOpen: isCvOpen } = useCvModal()
  const [isPointer, setIsPointer] = useState(false)
  const isPointerRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(false)

  // Hide custom cursor immediately when CV modal opens
  useEffect(() => {
    if (isCvOpen) {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (followerRef.current) followerRef.current.style.opacity = '0'
      isVisibleRef.current = false
    }
  }, [isCvOpen])

  useEffect(() => {
    setMounted(true)
    let rafPending = false
    let latestX = 0
    let latestY = 0

    const updatePosition = () => {
      rafPending = false
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%)`
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%)`
      }
      // Update background glow position
      document.documentElement.style.setProperty('--mouse-x', `${latestX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${latestY}px`)
    }
    
    const onMouseMove = (e: MouseEvent) => {
      latestX = e.clientX
      latestY = e.clientY
      const target = e.target as HTMLElement

      // Si estamos dentro del visor de CV / PDF, ocultar cursor personalizado para usar el normal
      const isInsideNative = !!target?.closest?.('[data-native-cursor]')
      if (isInsideNative || isCvOpen) {
        if (cursorRef.current) cursorRef.current.style.opacity = '0'
        if (followerRef.current) followerRef.current.style.opacity = '0'
        isVisibleRef.current = false
        return
      }
      
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
        if (followerRef.current) followerRef.current.style.opacity = '1'
      }

      if (!rafPending) {
        rafPending = true
        window.requestAnimationFrame(updatePosition)
      }

      const isClickable = !!(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.style.cursor === 'pointer'
      )
      
      if (isPointerRef.current !== isClickable) {
        isPointerRef.current = isClickable
        setIsPointer(isClickable)
      }
    }

    const onMouseLeave = () => {
      isVisibleRef.current = false
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (followerRef.current) followerRef.current.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.body.addEventListener('mouseleave', onMouseLeave)
    document.body.addEventListener('mouseenter', () => {
      if (!isCvOpen) {
        isVisibleRef.current = true
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
        if (followerRef.current) followerRef.current.style.opacity = '1'
      }
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [isCvOpen])

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
