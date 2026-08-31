import { useMemo } from 'react'
import styles from './FallingLeaves.module.css'

const LEAF_COLORS = ['#6fae5b', '#4f9a45', '#8cc06a', '#3f8a3a', '#a7d17e', '#5ea86f']
const LEAF_COUNT = 18

type LeafConfig = {
  left: number // %
  size: number // px
  fallDuration: number // s
  swayDuration: number // s
  delay: number // s (negative so leaves are mid-fall on load)
  color: string
}

function buildLeaves(count: number): LeafConfig[] {
  return Array.from({ length: count }, () => {
    const fallDuration = 8 + Math.random() * 8 // 8–16s
    return {
      left: Math.random() * 100,
      size: 12 + Math.random() * 14, // 12–26px
      fallDuration,
      swayDuration: 2 + Math.random() * 2.5, // 2–4.5s
      // Negative delay up to one full fall so the loop is already
      // populated the instant the section appears.
      delay: -Math.random() * fallDuration,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    }
  })
}

function FallingLeaves() {
  // Build once so leaves keep stable, continuous loops across re-renders.
  const leaves = useMemo(() => buildLeaves(LEAF_COUNT), [])

  return (
    <div className={styles.layer} aria-hidden="true">
      {leaves.map((leaf, i) => (
        <div
          key={i}
          className={styles.drop}
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.fallDuration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          <div
            className={styles.leaf}
            style={
              {
                width: `${leaf.size}px`,
                height: `${leaf.size}px`,
                animationDuration: `${leaf.swayDuration}s`,
                '--leaf-color': leaf.color,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  )
}

export default FallingLeaves
