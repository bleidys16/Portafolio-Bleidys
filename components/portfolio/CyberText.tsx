'use client'

import { useEffect, useState } from 'react'

interface CyberTextProps {
  text: string
  highlight?: string
  className?: string
  highlightClassName?: string
}

export default function CyberText({ text, highlight, className, highlightClassName }: CyberTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [displayHighlight, setDisplayHighlight] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let currentIndex = 0
    let highlightIndex = 0

    const typeText = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex))
        currentIndex++
        timeout = setTimeout(typeText, 40)
      } else if (highlight && highlightIndex <= highlight.length) {
        setDisplayHighlight(highlight.substring(0, highlightIndex))
        highlightIndex++
        timeout = setTimeout(typeText, 40)
      } else {
        setIsComplete(true)
      }
    }

    // Small delay before starting
    timeout = setTimeout(typeText, 100)

    return () => clearTimeout(timeout)
  }, [text, highlight])

  return (
    <h2 className={className}>
      {displayText}
      {highlight && <span className={highlightClassName}>{displayHighlight}</span>}
      {!isComplete && <span className="cursor-blink">|</span>}
      <style jsx>{`
        .cursor-blink {
          font-weight: 300;
          opacity: 1;
          animation: blink 1s step-end infinite;
          margin-left: 2px;
          color: var(--color-accent-purple);
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </h2>
  )
}
