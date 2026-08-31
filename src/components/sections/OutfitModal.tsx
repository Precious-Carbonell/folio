import { useEffect } from 'react'
import styles from './OutfitModal.module.css'

export type Project = {
  name: string
  description: string
  thumbnail?: string
  websiteUrl?: string
  videoUrl?: string
}

export type OutfitProfile = {
  videoSrc: string
  role: string
  stack: string[]
  projects: Project[]
}

type OutfitModalProps = {
  profile: OutfitProfile
  onClose: () => void
}

function OutfitModal({ profile, onClose }: OutfitModalProps) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Stop clicks inside the dialog from closing it. */}
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Left panel: looping video + role + tech stack */}
        <div className={styles.panel}>
          <video
            className={styles.video}
            src={profile.videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
          <h2 className={styles.role}>{profile.role}</h2>
          <p className={styles.stackLabel}>Tech Stack</p>
          <div className={styles.stack}>
            {profile.stack.map((tech) => (
              <span key={tech} className={styles.chip}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right panel: scrollable projects */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Projects</h3>
          <div className={styles.projects}>
            {profile.projects.map((project, i) => (
              <article key={i} className={styles.project}>
                <div className={styles.thumb}>
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt=""
                      className={styles.thumbImg}
                    />
                  ) : (
                    i + 1
                  )}
                </div>
                <div className={styles.projectBody}>
                  <span className={styles.projectName}>{project.name}</span>
                  <p className={styles.projectDesc}>{project.description}</p>
                  <div className={styles.projectActions}>
                    <a
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      href={project.websiteUrl ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit Website
                    </a>
                    <a
                      className={`${styles.btn} ${styles.btnGhost}`}
                      href={project.videoUrl ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutfitModal
