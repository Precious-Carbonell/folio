import { useEffect, useState } from 'react'
import styles from './Section3.module.css'
import projects1 from '../../assets/section3/projects1.png'
import projects2 from '../../assets/section3/projects2.png'

const FRAMES = [projects1, projects2]
const FRAME_INTERVAL_MS = 450

/** Alternates projects1/projects2 in place to look animated. */
function ProjectsAnimation() {
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
      className={styles.projectsAnim}
    />
  )
}

export default ProjectsAnimation
