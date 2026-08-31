import { useEffect, useRef, useState } from 'react'

// Import all audio files in the herosection/audios folder.
const audioModules = import.meta.glob(
  '../../assets/herosection/audios/*.mp3',
  { eager: true, import: 'default' },
) as Record<string, string>

const AUDIO_SRCS = Object.values(audioModules)

const INTERVAL_MS = 20_000

/**
 * Plays a random hero-section audio every 20 seconds while the hero room
 * is the active room. Stops immediately when the room is no longer active.
 *
 * Returns `isPlaying`, which is true while an audio clip is actively
 * playing (used to swap the walking frames to the "talking" variant).
 *
 * Note: browsers block audio until the user has interacted with the page,
 * so playback starts only after the first user gesture.
 */
export function useHeroAudio(active: boolean) {
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const hasInteractedRef = useRef(false)

  // Create the audio element once.
  useEffect(() => {
    if (AUDIO_SRCS.length === 0) return

    const audio = new Audio()
    audio.preload = 'auto'
    audioRef.current = audio

    const handlePlaying = () => setIsPlaying(true)
    const handleStopped = () => setIsPlaying(false)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handleStopped)
    audio.addEventListener('ended', handleStopped)

    // Track the first user gesture so playback is allowed.
    const onFirstInteraction = () => {
      hasInteractedRef.current = true
    }
    window.addEventListener('pointerdown', onFirstInteraction)
    window.addEventListener('keydown', onFirstInteraction)
    window.addEventListener('wheel', onFirstInteraction)

    return () => {
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handleStopped)
      audio.removeEventListener('ended', handleStopped)
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
      window.removeEventListener('wheel', onFirstInteraction)
      audioRef.current = null
    }
  }, [])

  // Start/stop the loop based on whether the hero room is active.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || AUDIO_SRCS.length === 0) return

    const playRandom = () => {
      const src = AUDIO_SRCS[Math.floor(Math.random() * AUDIO_SRCS.length)]
      audio.src = src
      audio.currentTime = 0
      // play() can reject if autoplay is blocked; ignore that quietly.
      void audio.play().catch(() => {})
    }

    const stopLoop = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      audio.pause()
    }

    if (active) {
      // Only start if a user gesture has happened (browser autoplay rule).
      // Poll briefly so it kicks in right after the first interaction.
      const tryStart = () => {
        if (!hasInteractedRef.current) return false
        if (intervalRef.current !== null) return true
        playRandom()
        intervalRef.current = window.setInterval(playRandom, INTERVAL_MS)
        return true
      }

      if (!tryStart()) {
        const poll = window.setInterval(() => {
          if (tryStart()) clearInterval(poll)
        }, 300)
        return () => {
          clearInterval(poll)
          stopLoop()
        }
      }

      return stopLoop
    } else {
      stopLoop()
    }
  }, [active])

  return { isPlaying }
}
