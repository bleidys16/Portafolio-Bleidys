'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useCvModal } from '@/context/CvModalContext'
import styles from './CvModal.module.css'

export default function CvModal() {
  const { language } = useLanguage()
  const { isOpen, closeCv } = useCvModal()
  const [viewMode, setViewMode] = useState<'document' | 'pdf'>('document')
  const [zoom, setZoom] = useState<number>(100)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCv()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeCv])

  if (!isOpen) return null

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 160))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 75))
  const handleResetZoom = () => setZoom(100)

  const isEs = language === 'es'

  return (
    <div
      className={styles.overlay}
      data-native-cursor="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCv()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Hoja de Vida de Bleidys Larios"
    >
      <div className={styles.modal} data-native-cursor="true">
        {/* Header toolbar */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrapper}>
            <span className={styles.titleIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <h3 className={styles.title}>
              {isEs ? 'Hoja de Vida · Bleidys Larios' : 'Resume · Bleidys Larios'}
            </h3>
            <span className={styles.badge}>
              {isEs ? 'Actualizada 2026' : 'Updated 2026'}
            </span>
          </div>

          <div className={styles.controls}>
            {/* View Switcher */}
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${viewMode === 'document' ? styles.toggleBtnActive : ''}`}
                onClick={() => setViewMode('document')}
              >
                {isEs ? 'Vista Documento' : 'Document View'}
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${viewMode === 'pdf' ? styles.toggleBtnActive : ''}`}
                onClick={() => setViewMode('pdf')}
              >
                {isEs ? 'PDF Original' : 'Original PDF'}
              </button>
            </div>

            {/* Zoom controls for document view */}
            {viewMode === 'document' && (
              <div className={styles.zoomControls}>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className={styles.zoomBtn}
                  aria-label="Reducir zoom"
                  title="Reducir zoom"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className={styles.zoomValue}
                  title="Restablecer zoom"
                >
                  {zoom}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className={styles.zoomBtn}
                  aria-label="Aumentar zoom"
                  title="Aumentar zoom"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={closeCv}
              className={styles.closeBtn}
              aria-label={isEs ? 'Cerrar' : 'Close'}
              title={isEs ? 'Cerrar (Esc)' : 'Close (Esc)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className={styles.body}>
          {viewMode === 'pdf' ? (
            <iframe
              src="/BleidysLarios_HojadeVida.pdf#toolbar=0&navpanes=0"
              className={styles.pdfFrame}
              title="Bleidys Larios - Hoja de Vida PDF"
            />
          ) : (
            <div
              className={styles.paperWrapper}
              style={{
                transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
              }}
            >
              <article className={styles.paper}>
                {/* Header */}
                <header className={styles.docHeader}>
                  <h1 className={styles.docName}>BLEIDYS PAOLA LARIOS TORREGROSA</h1>
                  <p className={styles.docContact}>
                    Barranquilla, Colombia (Cra 30 # 55b 27)
                    <span className={styles.docSeparator}>|</span>
                    +57 305 393 6447
                    <span className={styles.docSeparator}>|</span>
                    <a href="mailto:lariosbleidys@gmail.com">lariosbleidys@gmail.com</a>
                    <br />
                    <a href="https://linkedin.com/in/bleidyspaolalarios1608" target="_blank" rel="noopener noreferrer">
                      linkedin.com/in/bleidyspaolalarios1608
                    </a>
                    <span className={styles.docSeparator}>|</span>
                    <a href="https://github.com/bleidys16" target="_blank" rel="noopener noreferrer">
                      github.com/bleidys16
                    </a>
                    <span className={styles.docSeparator}>|</span>
                    <a href="https://portafoliobleidys.vercel.app" target="_blank" rel="noopener noreferrer">
                      portafoliobleidys.vercel.app
                    </a>
                  </p>
                </header>

                {/* Perfil Profesional */}
                <section className={styles.docSection}>
                  <h2 className={styles.sectionHeader}>PERFIL PROFESIONAL</h2>
                  <p className={styles.sectionBody}>
                    Desarrolladora Full Stack e investigadora de software con sólida trayectoria en el desarrollo de aplicaciones web y móviles de alto rendimiento. Especializada en la integración de arquitecturas frontend modernas (React, Next.js, Angular, TypeScript) con microservicios y backends robustos (Django, Node.js, Python, PostgreSQL). Experiencia comprobada en despliegue de modelos de Machine Learning, pipelines ETL, procesamiento de lenguaje natural (NLP) y metodologías ágiles (Scrum/Kanban).
                  </p>
                </section>

                {/* Logros y Reconocimientos */}
                <section className={styles.docSection}>
                  <h2 className={styles.sectionHeader}>LOGROS Y RECONOCIMIENTOS</h2>
                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>2.° Lugar — Bootcamp Digital Factory &amp; AI</span>
                      <span className={styles.itemMeta}>SuperBrix | 2026</span>
                    </div>
                    <div className={styles.itemSubHeader}>
                      <span className={styles.itemSubTitle}>Desarrolladora Principal de Solución IoT &amp; Machine Learning</span>
                      <span className={styles.itemLocation}>Barranquilla, Colombia</span>
                    </div>
                    <ul className={styles.bulletList}>
                      <li className={styles.bulletItem}>
                        Diseño e implementación de un sistema mobile IoT integrado con Groq AI para procesamiento de lenguaje natural (NLP) en tiempo real, optimizando el análisis predictivo de fallas operativas industriales.
                      </li>
                      <li className={styles.bulletItem}>
                        Construcción de un dashboard interactivo de análisis de Pareto para la toma de decisiones basada en datos críticos de producción, reduciendo tiempos de diagnóstico de incidentes.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Proyectos de Ingeniería y Software */}
                <section className={styles.docSection}>
                  <h2 className={styles.sectionHeader}>PROYECTOS DE INGENIERÍA Y SOFTWARE</h2>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>INTELLIXXY — Plataforma Educativa con Inteligencia Artificial</span>
                      <span className={styles.itemMeta}>Next.js, TypeScript, PostgreSQL, Capacitor, APIs IA</span>
                    </div>
                    <ul className={styles.bulletList}>
                      <li className={styles.bulletItem}>
                        Desarrollo multiplataforma (Web y Android APK) que procesa documentos PDF para generar automáticamente cuestionarios interactivos, flashcards y tutoría virtual con citaciones bibliográficas exactas.
                      </li>
                    </ul>
                  </div>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>VITA-CLINICAL — Sistema de Analítica Clínica y Predicción</span>
                      <span className={styles.itemMeta}>Django DRF, Python, PostgreSQL, scikit-learn, Pandas</span>
                    </div>
                    <ul className={styles.bulletList}>
                      <li className={styles.bulletItem}>
                        Plataforma de análisis de salud con canalización ETL automatizada, tableros de control con KPIs hospitalarios y clasificador de Machine Learning para segmentación de riesgo clínico.
                      </li>
                    </ul>
                  </div>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>SOPORTIX — Plataforma Helpdesk y Gestión Operativa</span>
                      <span className={styles.itemMeta}>Angular, TypeScript, Django REST Framework, PostgreSQL</span>
                    </div>
                    <ul className={styles.bulletList}>
                      <li className={styles.bulletItem}>
                        Sistema empresarial de gestión de tickets por roles (usuario, analista, admin) con trazabilidad de incidentes, mensajería interna, manejo de adjuntos y módulos analíticos de resolución.
                      </li>
                    </ul>
                  </div>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>ANALYZOR — Suite Ligera de Business Intelligence (Mini BI)</span>
                      <span className={styles.itemMeta}>Python, React, NLP, Data Visualization</span>
                    </div>
                    <ul className={styles.bulletList}>
                      <li className={styles.bulletItem}>
                        Motor de inteligencia de negocios para ingesta y análisis estadístico de datasets CSV mediante consultas de datos en lenguaje natural y visualización dinámica interactiva.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Educación y Formación Académica */}
                <section className={styles.docSection}>
                  <h2 className={styles.sectionHeader}>EDUCACIÓN Y FORMACIÓN ACADÉMICA</h2>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>Institución Universitaria Digital de Antioquia</span>
                      <span className={styles.itemLocation}>Medellín, Colombia (Modalidad Virtual)</span>
                    </div>
                    <div className={styles.itemSubHeader}>
                      <span className={styles.itemSubTitle}>Ingeniería de Software y Datos — 3.er Semestre (En curso)</span>
                      <span className={styles.itemMeta}>2025 – Presente</span>
                    </div>
                  </div>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>Servicio Nacional de Aprendizaje (SENA)</span>
                      <span className={styles.itemLocation}>Barranquilla, Colombia</span>
                    </div>
                    <div className={styles.itemSubHeader}>
                      <span className={styles.itemSubTitle}>Tecnólogo en Análisis y Desarrollo de Software (ADSO) — En formación</span>
                      <span className={styles.itemMeta}>Abr. 2025 – Sep. 2027</span>
                    </div>
                  </div>

                  <div className={styles.itemBlock}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>Servicio Nacional de Aprendizaje (SENA)</span>
                      <span className={styles.itemLocation}>Barranquilla, Colombia</span>
                    </div>
                    <div className={styles.itemSubHeader}>
                      <span className={styles.itemSubTitle}>Técnico en Programación de Software — Titulada</span>
                      <span className={styles.itemMeta}>Ene. 2023 – Nov. 2024</span>
                    </div>
                  </div>
                </section>

                {/* Habilidades Técnicas y Competencias */}
                <section className={styles.docSection}>
                  <h2 className={styles.sectionHeader}>HABILIDADES TÉCNICAS Y COMPETENCIAS</h2>
                  <p className={styles.skillsGroup}>
                    <span className={styles.skillLabel}>Lenguajes y Backend: </span>
                    <span className={styles.skillValue}>Python, TypeScript, JavaScript, Node.js, Express, Django REST Framework, SQL.</span>
                  </p>
                  <p className={styles.skillsGroup}>
                    <span className={styles.skillLabel}>Frontend &amp; Mobile: </span>
                    <span className={styles.skillValue}>React, Next.js, Angular, Tailwind CSS, Bootstrap, HTML5/CSS3, Capacitor, UI/UX Design.</span>
                  </p>
                  <p className={styles.skillsGroup}>
                    <span className={styles.skillLabel}>Datos &amp; Machine Learning: </span>
                    <span className={styles.skillValue}>Pandas, scikit-learn, Pipelines ETL, NLP (Groq / Gemini APIs), Data Analytics &amp; BI.</span>
                  </p>
                  <p className={styles.skillsGroup}>
                    <span className={styles.skillLabel}>Bases de Datos &amp; Cloud: </span>
                    <span className={styles.skillValue}>PostgreSQL, Supabase, Neon DB, Docker, Vercel, Render, Git/GitHub.</span>
                  </p>
                  <p className={styles.skillsGroup}>
                    <span className={styles.skillLabel}>Idiomas &amp; Metodologías: </span>
                    <span className={styles.skillValue}>Español (Nativo), Inglés (Intermedio B1); Scrum, Kanban, Pruebas de Software (QA).</span>
                  </p>
                  <p className={styles.skillsGroup}>
                    <span className={styles.skillLabel}>Certificaciones Continuas: </span>
                    <span className={styles.skillValue}>Variables y Estructuras Python (SENA), CCNA Exploration (Redes LAN/Inalámbricas), QA Testing.</span>
                  </p>
                </section>
              </article>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

