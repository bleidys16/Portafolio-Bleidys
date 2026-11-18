'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface CvModalContextType {
  isOpen: boolean
  openCv: () => void
  closeCv: () => void
}

const CvModalContext = createContext<CvModalContextType | undefined>(undefined)

export function CvModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCv = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCv = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  return (
    <CvModalContext.Provider value={{ isOpen, openCv, closeCv }}>
      {children}
    </CvModalContext.Provider>
  )
}

export function useCvModal() {
  const context = useContext(CvModalContext)
  if (!context) {
    throw new Error('useCvModal must be used within a CvModalProvider')
  }
  return context
}

