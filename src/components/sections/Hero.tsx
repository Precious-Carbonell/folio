import { useRef } from 'react'
import styles from './Hero.module.css'
import heroBg from '../../assets/background.jpg'
import titleImg from '../../assets/herosection/title.png'
import WalkAnimation from './WalkAnimation'
import FallingLeaves from './FallingLeaves'
import { useHeroAudio } from './useHeroAudio'

function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const { isPlaying } = useHeroAudio(sectionRef)

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={styles.hero}
      style={{ '--hero-bg': `url(${heroBg})` } as React.CSSProperties}
    >
      <FallingLeaves />

      <div className={styles.center}>
        <img src={titleImg} alt="Title" className={styles.title} />
        <WalkAnimation talking={isPlaying} />
      </div>
    </section>
  )
}

export default Hero
