// Loads every mp3 in assets/buttons so new files are picked up automatically.
const soundModules = import.meta.glob('../assets/buttons/*.mp3', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const ALL_SOUNDS = Object.entries(soundModules)

// Click sounds = everything except an optional dedicated "hover.mp3".
const BUTTON_SOUNDS = ALL_SOUNDS.filter(
  ([path]) => !/hover\.mp3$/i.test(path),
).map(([, src]) => src)

// If a hover.mp3 exists in assets/buttons it's used for hovers; otherwise
// hovers fall back to the regular button sounds.
const HOVER_SOUND =
  ALL_SOUNDS.find(([path]) => /hover\.mp3$/i.test(path))?.[1] ?? null

/**
 * Plays a random button click sound from assets/buttons.
 * Safe to call on any click; fails silently if playback is blocked.
 */
export function playRandomButtonSound() {
  const pool = BUTTON_SOUNDS.length ? BUTTON_SOUNDS : ALL_SOUNDS.map(([, s]) => s)
  if (pool.length === 0) return

  const src = pool[Math.floor(Math.random() * pool.length)]
  const audio = new Audio(src)
  void audio.play().catch(() => {})
}

// Single reusable element for hover sounds + a cooldown so rapidly
// sweeping across items doesn't stack up overlapping blips.
let hoverAudio: HTMLAudioElement | null = null
let lastHoverAt = 0
const HOVER_COOLDOWN_MS = 220

/**
 * Plays a soft hover sound. Uses hover.mp3 if present, otherwise a random
 * button sound (played a bit quieter than a click).
 *
 * Reuses one audio element and enforces a short cooldown, so hovering
 * quickly over many items won't pile up overlapping sounds.
 */
export function playHoverSound() {
  const now = Date.now()
  if (now - lastHoverAt < HOVER_COOLDOWN_MS) return
  lastHoverAt = now

  let src = HOVER_SOUND
  if (!src) {
    const pool = BUTTON_SOUNDS.length
      ? BUTTON_SOUNDS
      : ALL_SOUNDS.map(([, s]) => s)
    if (pool.length === 0) return
    src = pool[Math.floor(Math.random() * pool.length)]
  }

  if (!hoverAudio) {
    hoverAudio = new Audio()
    hoverAudio.volume = 0.4
  }

  // Restart the shared element so a new hover replaces the old sound
  // instead of layering on top of it.
  hoverAudio.pause()
  hoverAudio.src = src
  hoverAudio.currentTime = 0
  void hoverAudio.play().catch(() => {})
}
