import { useEffect, useState } from 'react'
import styles from './Hero.module.css'
import walk1 from '../../assets/herosection/walk1.png'
import walk2 from '../../assets/herosection/walk2.png'
import wtalk1 from '../../assets/herosection/wtalk1.png'
import wtalk2 from '../../assets/herosection/wtalk2.png'

const WALK_FRAMES = [walk1, walk2]
const TALK_FRAMES = [wtalk1, wtalk2]
const FRAME_INTERVAL_MS = 250

type WalkAnimationProps = {
  /** When true, use the "walk + talk" frames instead of the plain walk frames. */
  talking?: boolean
}

function WalkAnimation({ talking = false }: WalkAnimationProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % 2)
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  const frames = talking ? TALK_FRAMES : WALK_FRAMES

  return (
    <img
      src={frames[frame]}
      alt="Walking animation"
      className={styles.walk}
    />
  )
}

export default WalkAnimation
