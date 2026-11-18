'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { dictionary } from '@/lib/dictionary'
import styles from './Navigation.module.css'

const SECTIONS = ['inicio', 'sobre-mi', 'servicios', 'proyectos', 'testimonios', 'contacto']

export default function Navigation() {
  const { language, toggleLanguage } = useLanguage()
  const content = dictionary[language].nav
  const [activeSection, setActiveSection] = useState('inicio')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  const navItems = [
    { 
      href: '#inicio', 
      label: content.home,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    { 
      href: '#sobre-mi', 
      label: content.about,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    { 
      href: '#servicios', 
      label: content.services,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      )
    },
    { 
      href: '#proyectos', 
      label: content.projects,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    { 
      href: '#testimonios', 
      label: content.testimonials,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    },
    { 
      href: '#contacto', 
      label: content.contact,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      )
    },
  ]

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          // Controlar la visibilidad de la barra
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false) // Haciendo scroll hacia abajo: ocultar
          } else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true) // Haciendo scroll hacia arriba: mostrar
          }
          
          lastScrollY.current = currentScrollY
          setIsScrolled(currentScrollY > 50)

          const scrollPosition = currentScrollY + 220
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const section = document.getElementById(SECTIONS[i])
            if (section && section.offsetTop <= scrollPosition) {
              setActiveSection(SECTIONS[i])
              break
            }
          }
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.wrapper}>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''} ${!isVisible ? styles.hidden : ''}`}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <a
                href={item.href}
                className={`${styles.navLink} ${
                  activeSection === item.href.replace('#', '')
                    ? styles.active
                    : ''
                }`}
                aria-label={item.label}
              >
                {item.icon}
              </a>
              <span className={styles.navLabel}>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.divider}></div>

        <button 
          onClick={toggleLanguage} 
          className={styles.langToggle}
          aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <svg className={styles.langIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span className={styles.langText}>{language === 'es' ? 'ES' : 'EN'}</span>
        </button>
      </nav>
    </div>
  )
}