import { useEffect, useState } from 'react'
import styles from './Section2.module.css'
import aboutme1 from '../../assets/section2/aboutme1.png'
import aboutme2 from '../../assets/section2/aboutme2.png'

const FRAMES = [aboutme1, aboutme2]
const FRAME_INTERVAL_MS = 450

/** Alternates aboutme1/aboutme2 in place to look animated. */
function AboutMeAnimation() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length)
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  return (
    <img
      src={FRAMES[frame]}
      alt=""
      aria-hidden="true"
      className={styles.aboutMe}
    />
  )
}

export default AboutMeAnimation
