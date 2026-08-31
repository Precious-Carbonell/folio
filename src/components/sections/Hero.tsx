import styles from './Hero.module.css'
import heroBg from '../../assets/background.jpg'
import WalkAnimation from './WalkAnimation'
import TitleAnimation from './TitleAnimation'
import FallingLeaves from './FallingLeaves'
import { useHeroAudio } from './useHeroAudio'

type HeroProps = {
  active?: boolean
}

function Hero({ active = false }: HeroProps) {
  const { isPlaying } = useHeroAudio(active)

  return (
    <section
      id="hero"
      className={styles.hero}
      style={{ '--hero-bg': `url(${heroBg})` } as React.CSSProperties}
    >
      <FallingLeaves />

      <div className={styles.center}>
        <TitleAnimation />
        <WalkAnimation talking={isPlaying} />
      </div>
    </section>
  )
}

export default Hero
