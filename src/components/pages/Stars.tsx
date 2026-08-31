import { useMemo } from 'react'
import styles from './Stars.module.css'

const STAR_COUNT = 60

type StarConfig = {
  top: number // %
  left: number // %
  size: number // px
  duration: number // s
  delay: number // s
}

function buildStars(count: number): StarConfig[] {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 2 + Math.random() * 4, // 2–6px
    duration: 1.5 + Math.random() * 3, // 1.5–4.5s
    delay: -Math.random() * 4, // negative so they're mid-twinkle on load
  }))
}

function Stars() {
  // Build once so positions stay stable across re-renders.
  const stars = useMemo(() => buildStars(STAR_COUNT), [])

  return (
    <div className={styles.layer} aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default Stars
