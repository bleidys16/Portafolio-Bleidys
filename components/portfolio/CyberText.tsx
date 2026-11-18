'use client'

import { useEffect, useState } from 'react'

interface CyberTextProps {
  text: string
  highlight?: string
  className?: string
  highlightClassName?: string
}

export default function CyberText({
  text,
  highlight = '',
  className,
  highlightClassName,
}: CyberTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [displayHighlight, setDisplayHighlight] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let isCancelled = false

    // Reset state cleanly whenever text or highlight changes (evita mezclas entre español e inglés)
    setDisplayText('')
    setDisplayHighlight('')
    setIsComplete(false)

    let currentTextIdx = 0
    let currentHighlightIdx = 0

    // Velocidad original de tipeo (40ms)
    const speed = 40

    const step = () => {
      if (isCancelled) return

      if (currentTextIdx < text.length) {
        currentTextIdx++
        setDisplayText(text.slice(0, currentTextIdx))
        timeoutId = setTimeout(step, speed)
      } else if (highlight && currentHighlightIdx < highlight.length) {
        currentHighlightIdx++
        setDisplayHighlight(highlight.slice(0, currentHighlightIdx))
        timeoutId = setTimeout(step, speed)
      } else {
        setIsComplete(true)
      }
    }

    // Retardo inicial original
    timeoutId = setTimeout(step, 100)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [text, highlight])

  return (
    <h2 className={className}>
      {displayText}
      {highlight && (
        <span className={highlightClassName}>{displayHighlight}</span>
      )}
      {!isComplete && <span className="cursor-blink" aria-hidden="true">|</span>}
      <style jsx>{`
        .cursor-blink {
          font-weight: 300;
          display: inline-block;
          animation: blink 0.8s step-end infinite;
          margin-left: 2px;
          color: var(--color-accent-purple);
          vertical-align: baseline;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </h2>
  )
}
