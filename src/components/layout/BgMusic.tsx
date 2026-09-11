import { useEffect, useRef, useState } from 'react'
import styles from './BgMusic.module.css'
import bgMusic from '../../assets/bgmusic.mp3'

// Volume cycle: full -> 66% -> 33% -> muted -> full ...
// bars is how many sound waves to draw beside the megaphone.
const LEVELS = [
  { volume: 0.35, bars: 3 },
  { volume: 0.23, bars: 2 },
  { volume: 0.12, bars: 1 },
  { volume: 0, bars: 0 }, // muted -> shows an X
] as const

/** Megaphone icon with a variable number of sound bars, or an X if muted. */
function MegaphoneIcon({ bars, muted }: { bars: number; muted: boolean }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Megaphone body */}
      <path d="M4 13 L15 9 L15 21 L4 17 Z" fill="currentColor" stroke="none" />
      <path d="M4 13 L15 9 L15 21 L4 17 Z" />
      <path d="M6 17 L6 22 L9 22 L8.5 18" fill="currentColor" stroke="none" />

      {/* Sound bars (drawn based on level) */}
      {bars >= 1 && <path d="M18 16 h2" />}
      {bars >= 2 && <path d="M19 12 q4 4 0 8" />}
      {bars >= 3 && <path d="M22 9 q7 7 0 14" />}

      {/* Muted X */}
      {muted && (
        <>
          <path d="M19 12 L26 20" stroke="#e06a6a" />
          <path d="M26 12 L19 20" stroke="#e06a6a" />
        </>
      )}
    </svg>
  )
}

/**
 * Looping background music with a volume-cycle button (matches the nav
 * button style). Cycles full -> 66% -> 33% -> muted on each press.
 * Attempts to autoplay; unmutes/starts on the first user interaction.
 */
function BgMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [levelIndex, setLevelIndex] = useState(0)
  const levelRef = useRef(0)

  useEffect(() => {
    const audio = new Audio(bgMusic)
    audio.loop = true
    audio.volume = LEVELS[0].volume
    audio.preload = 'auto'
    audioRef.current = audio

    // Try to autoplay; if blocked, start on the first user gesture.
    void audio.play().catch(() => {
      audio.muted = true
      void audio.play().catch(() => {})
    })

    let unlocked = false
    const events = [
      'pointerdown',
      'pointermove',
      'mousemove',
      'keydown',
      'wheel',
      'touchstart',
      'scroll',
    ] as const

    const removeListeners = () => {
      events.forEach((e) =>
        window.removeEventListener(e, unlock, { capture: true }),
      )
    }

    function unlock() {
      if (unlocked) return
      unlocked = true
      // Restore whatever level is currently selected.
      audio.muted = false
      audio.volume = LEVELS[levelRef.current].volume
      void audio.play().catch(() => {})
      removeListeners()
    }

    events.forEach((e) =>
      window.addEventListener(e, unlock, { capture: true }),
    )

    return () => {
      removeListeners()
      audio.pause()
    }
  }, [])

  const cycle = () => {
    const next = (levelRef.current + 1) % LEVELS.length
    levelRef.current = next
    setLevelIndex(next)

    const audio = audioRef.current
    if (!audio) return
    audio.muted = false
    audio.volume = LEVELS[next].volume
    // Make sure it's actually playing (in case autoplay was blocked).
    if (audio.paused) void audio.play().catch(() => {})
  }

  const level = LEVELS[levelIndex]
  const muted = level.bars === 0

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={cycle}
        aria-label={muted ? 'Music muted, click to unmute' : 'Adjust music volume'}
        title={muted ? 'Muted' : 'Music volume'}
      >
        <MegaphoneIcon bars={level.bars} muted={muted} />
      </button>
    </div>
  )
}

export default BgMusic
