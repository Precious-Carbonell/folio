import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import styles from './RoomDeck.module.css'

const TRANSITION_MS = 620

type RoomDeckProps = {
  rooms: ReactNode[]
  activeIndex: number
  onChange: (index: number) => void
}

function RoomDeck({ rooms, activeIndex, onChange }: RoomDeckProps) {
  // Track the room that's animating out so it can fade while the new
  // one fades in.
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null)
  const prevIndexRef = useRef(activeIndex)
  const lockRef = useRef(false)

  // When activeIndex changes, mark the previous room as "leaving" and
  // clear it once the transition finishes.
  useEffect(() => {
    const prev = prevIndexRef.current
    if (prev !== activeIndex) {
      setLeavingIndex(prev)
      prevIndexRef.current = activeIndex
      lockRef.current = true

      const t = window.setTimeout(() => {
        setLeavingIndex(null)
        lockRef.current = false
      }, TRANSITION_MS)

      return () => clearTimeout(t)
    }
  }, [activeIndex])

  const goTo = useCallback(
    (index: number) => {
      if (lockRef.current) return
      if (index < 0 || index >= rooms.length) return
      if (index === activeIndex) return
      onChange(index)
    },
    [activeIndex, rooms.length, onChange],
  )

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex])
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex])

  // Keyboard: left/right/up/down arrows move between rooms.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Wheel: scrolling down/up moves to the next/previous room. Debounced
  // by the transition lock so one gesture = one room.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return
      if (Math.abs(e.deltaY) < 20) return
      if (e.deltaY > 0) next()
      else prev()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [next, prev])

  return (
    <div className={styles.deck}>
      {rooms.map((room, i) => {
        const isActive = i === activeIndex
        const isLeaving = i === leavingIndex
        const cls = [
          styles.room,
          isActive ? styles.active : '',
          isLeaving ? styles.leaving : '',
        ]
          .filter(Boolean)
          .join(' ')
        return (
          <div key={i} className={cls} aria-hidden={!isActive}>
            {room}
          </div>
        )
      })}

      {/* Prev / next arrows */}
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={prev}
        disabled={activeIndex === 0}
        aria-label="Previous room"
      >
        ‹
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={next}
        disabled={activeIndex === rooms.length - 1}
        aria-label="Next room"
      >
        ›
      </button>

      {/* Room progress dots */}
      <div className={styles.dots}>
        {rooms.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to room ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default RoomDeck
