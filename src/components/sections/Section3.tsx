import { useRef, useState } from 'react'
import styles from './Section3.module.css'
import bg from '../../assets/section3/s3wp.png'
import closetClosed from '../../assets/section3/cclose.png'
import closetOpen from '../../assets/section3/copen.png'
import outfit1 from '../../assets/section3/outfit1.png'
import outfit2 from '../../assets/section3/outfit2.png'
import outfit1Video from '../../assets/section3/outfit1.mp4'
import outfit2Video from '../../assets/section3/outfit2.mp4'
import closetSfx from '../../assets/section3/closetsfx.mp3'
import wdSample1 from '../../assets/section3/samples/WDsample1.png'
import wdSample2 from '../../assets/section3/samples/WDsample2.png'
import wdSample3 from '../../assets/section3/samples/WDsample3.png'
import mlSample1 from '../../assets/section3/samples/MLsample1.jpg'
import mlSample2 from '../../assets/section3/samples/MLsample2.jpg'
import mlSample3 from '../../assets/section3/samples/MLsample3.png'
import mlSample4 from '../../assets/section3/samples/MLsample4.png'
import mlSample5 from '../../assets/section3/samples/MLsample5.png'
import OutfitModal, { type OutfitProfile } from './OutfitModal'
import ProjectsAnimation from './ProjectsAnimation'
import { playHoverSound } from '../../lib/buttonSound'

// Web Developer profile (outfit 1).
const webDevProfile: OutfitProfile = {
  videoSrc: outfit1Video,
  role: 'Web Developer',
  stack: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'Node.js', 'TypeScript'],
  projects: [
    {
      name: 'Project One',
      description: 'lorem ipsum hatdog',
      thumbnail: wdSample1,
    },
    {
      name: 'Project Two',
      description: 'lorem ipsum hatdog',
      thumbnail: wdSample2,
    },
    {
      name: 'Project Three',
      description: 'lorem ipsum hatdog',
      thumbnail: wdSample3,
    },
  ],
}

// Data Analyst / ML Engineer profile (outfit 2).
const dataProfile: OutfitProfile = {
  videoSrc: outfit2Video,
  role: 'Data Analyst / ML Engineer',
  stack: ['Python', 'ETL', 'NLTK', 'Seaborn', 'Matplotlib', 'NumPy'],
  projects: [
    {
      name: 'Project One',
      description: 'lorem ipsum hatdog',
      thumbnail: mlSample1,
    },
    {
      name: 'Project Two',
      description: 'lorem ipsum hatdog',
      thumbnail: mlSample2,
    },
    {
      name: 'Project Three',
      description: 'lorem ipsum hatdog',
      thumbnail: mlSample3,
    },
    {
      name: 'Project Four',
      description: 'lorem ipsum hatdog',
      thumbnail: mlSample4,
    },
    {
      name: 'Project Five',
      description: 'lorem ipsum hatdog',
      thumbnail: mlSample5,
    },
  ],
}

function Section3() {
  const [open, setOpen] = useState(false)
  const [activeProfile, setActiveProfile] = useState<OutfitProfile | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleClick = () => {
    // Only play the sfx on the first click, when the closet actually opens.
    if (open) return

    setOpen(true)

    if (!audioRef.current) {
      audioRef.current = new Audio(closetSfx)
    }
    const audio = audioRef.current
    audio.currentTime = 0
    void audio.play().catch(() => {})
  }

  return (
    <section
      id="section-3"
      className={styles.section}
      style={{ '--section3-bg': `url(${bg})` } as React.CSSProperties}
    >
      <button
        type="button"
        className={styles.closet}
        onClick={handleClick}
        aria-label={open ? 'Closet open' : 'Open the closet'}
      >
        <img
          src={open ? closetOpen : closetClosed}
          alt={open ? 'Open closet' : 'Closed closet'}
          className={styles.closetImg}
        />

        {open && (
          <>
            <img
              src={outfit1}
              alt="Outfit 1 — Web Developer"
              className={`${styles.outfit} ${styles.outfit1}`}
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.stopPropagation()
                setActiveProfile(webDevProfile)
              }}
            />
            <img
              src={outfit2}
              alt="Outfit 2 — Data Analyst / ML Engineer"
              className={`${styles.outfit} ${styles.outfit2}`}
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.stopPropagation()
                setActiveProfile(dataProfile)
              }}
            />
          </>
        )}
      </button>

      <ProjectsAnimation />

      {activeProfile && (
        <OutfitModal
          profile={activeProfile}
          onClose={() => setActiveProfile(null)}
        />
      )}
    </section>
  )
}

export default Section3
