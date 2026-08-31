import { useEffect, useState } from 'react'
import styles from './Hero.module.css'
import title1 from '../../assets/herosection/title1.png'
import title2 from '../../assets/herosection/title2.png'

const FRAMES = [title1, title2]
const FRAME_INTERVAL_MS = 450

/** Alternates title1/title2 in place to look animated. */
function TitleAnimation() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length)
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  return <img src={FRAMES[frame]} alt="Title" className={styles.title} />
}

export default TitleAnimation
