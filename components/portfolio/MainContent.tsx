'use client'

import { useLanguage } from '@/context/LanguageContext'
import { dictionary } from '@/lib/dictionary'
import styles from './MainContent.module.css'
import CyberText from './CyberText'
import RevealSection from './RevealSection'
import TechGlobe from './TechGlobe'
import ContactForm from './ContactForm'

const skills = [
  'React', 'Next.js', 'TypeScript', 'Node.js',
  'JavaScript', 'HTML5', 'CSS3', 'Git',
  'MongoDB', 'PostgreSQL', 'Tailwind', 'Figma'
]

export default function MainContent() {
  const { language } = useLanguage()
  const content = dictionary[language]

  const stats = [
    { number: '+3', label: content.hero.statsLabel },
  ]

  const services = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
      title: content.services.list[0].title,
      description: content.services.list[0].description,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: content.services.list[1].title,
      description: content.services.list[1].description,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
      title: content.services.list[2].title,
      description: content.services.list[2].description,
    },
  ]

  const projects = content.projects.list.map((p: { title: string; description: string; tags: string[]; link: string; repo: string }) => ({
    title: p.title,
    description: p.description,
    tags: p.tags,
    link: p.link,
    repo: p.repo,
  }))

  const testimonials = content.testimonials.list

  return (
    <div className={styles.content}>
      {/* Hero Section */}
      <RevealSection className={styles.hero} id="inicio">
        <div className={styles.heroText}>
          <CyberText 
            text={content.hero.title1} 
            highlight={content.hero.highlight} 
            className={styles.heroTitle} 
            highlightClassName={styles.highlight}
          />
          <p className={styles.heroDescription}>
            {content.hero.description}
          </p>
        </div>

        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* About Section */}
      <RevealSection className={styles.section} id="sobre-mi">
        <h3 className={styles.sectionTitle}>{content.about.title}</h3>
        <div className={styles.aboutContent}>
          <p className={styles.aboutText}>
            {content.about.p1}
          </p>
          <p className={styles.aboutText}>
            {content.about.p2}
          </p>
        </div>

        <h4 className={styles.subsectionTitle}>{content.about.techTitle}</h4>
        <TechGlobe />
      </RevealSection>

      {/* Services Section */}
      <RevealSection className={styles.section} id="servicios">
        <h3 className={styles.sectionTitle}>{content.services.title}</h3>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>{service.icon}</div>
              <h4 className={styles.serviceTitle}>{service.title}</h4>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Projects Section */}
      <RevealSection className={styles.section} id="proyectos">
        <h3 className={styles.sectionTitle}>{content.projects.title}</h3>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectImagePlaceholder}>
                {project.title.toLowerCase().includes('cine') ? (
                  <img src="/cine.png" alt={project.title} className={styles.projectImage} decoding="async" loading="lazy" />
                ) : project.title.toLowerCase().includes('manjares') ? (
                  <img src="/manjares.png" alt={project.title} className={styles.projectImage} decoding="async" loading="lazy" />
                ) : project.title.toLowerCase().includes('analyzor') ? (
                  <div className={styles.analyzorIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="60" height="60">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  </div>
                ) : (
                  <span>{project.title.charAt(0)}</span>
                )}
                <div className={styles.projectOverlay}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Ver proyecto</span>
                </div>
              </a>
              <div className={styles.projectInfo}>
                <h4 className={styles.projectTitle}>{project.title}</h4>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectTags}>
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles.projectTag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.projectLinks}>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLinkBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Demo
                  </a>
                  <a href={project.repo} target="_blank" rel="noopener noreferrer" className={`${styles.projectLinkBtn} ${styles.projectLinkBtnGhost}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Testimonials Section */}
      <RevealSection className={styles.section} id="testimonios">
        <h3 className={styles.sectionTitle}>{content.testimonials.title}</h3>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t: { name: string; role: string; comment: string; stars: number }, index: number) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" width="18" height="18"
                    fill={i < t.stars ? 'var(--color-accent-gold)' : 'none'}
                    stroke={i < t.stars ? 'var(--color-accent-gold)' : 'var(--color-border)'}
                    strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className={styles.testimonialComment}>&ldquo;{t.comment}&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialRole}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Contact Section */}
      <RevealSection className={styles.section} id="contacto">
        <ContactForm content={content.contact} />
      </RevealSection>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {(new Date()).getFullYear()} Bleidys Larios. {content.footer.rights}</p>
      </footer>
    </div>
  )
}
