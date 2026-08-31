import { useEffect, useRef, useState } from 'react'

// Import all audio files in the herosection/audios folder.
const audioModules = import.meta.glob(
  '../../assets/herosection/audios/*.mp3',
  { eager: true, import: 'default' },
) as Record<string, string>

const AUDIO_SRCS = Object.values(audioModules)

const INTERVAL_MS = 20_000

/**
 * Plays a random hero-section audio every 20 seconds while the given
 * element (the first section) is visible in the viewport. Stops as soon
 * as the user scrolls away from it.
 *
 * Returns `isPlaying`, which is true while an audio clip is actively
 * playing (used to swap the walking frames to the "talking" variant).
 *
 * Note: browsers block audio until the user has interacted with the page,
 * so playback starts only after the first user gesture.
 */
export function useHeroAudio(ref: React.RefObject<HTMLElement | null>) {
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const isVisibleRef = useRef(false)
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || AUDIO_SRCS.length === 0) return

    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    // Keep isPlaying in sync with the actual audio element state.
    const handlePlaying = () => setIsPlaying(true)
    const handleStopped = () => setIsPlaying(false)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handleStopped)
    audio.addEventListener('ended', handleStopped)

    const playRandom = () => {
      const src = AUDIO_SRCS[Math.floor(Math.random() * AUDIO_SRCS.length)]
      audio.src = src
      audio.currentTime = 0
      // play() can reject if autoplay is blocked; ignore that quietly.
      void audio.play().catch(() => {})
    }

    const startLoop = () => {
      if (intervalRef.current !== null) return // already running
      playRandom() // play one immediately
      intervalRef.current = window.setInterval(playRandom, INTERVAL_MS)
    }

    const stopLoop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      audio.pause()
    }

    // Wait for the first user interaction before allowing playback,
    // since browsers block audio autoplay otherwise.
    const onFirstInteraction = () => {
      hasInteractedRef.current = true
      if (isVisibleRef.current) startLoop()
    }

    window.addEventListener('pointerdown', onFirstInteraction, { once: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true })
    window.addEventListener('scroll', onFirstInteraction, { once: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Consider the section "active" when at least half of it is visible.
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5
        isVisibleRef.current = visible

        if (visible) {
          if (hasInteractedRef.current) startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: [0, 0.5, 1] },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      stopLoop()
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handleStopped)
      audio.removeEventListener('ended', handleStopped)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
      window.removeEventListener('scroll', onFirstInteraction)
      audioRef.current = null
    }
  }, [ref])

  return { isPlaying }
}
