// Loads every mp3 in assets/buttons so new files are picked up automatically.
const soundModules = import.meta.glob('../assets/buttons/*.mp3', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const BUTTON_SOUNDS = Object.values(soundModules)

/**
 * Plays a random button click sound from assets/buttons.
 * Safe to call on any click; fails silently if playback is blocked.
 */
export function playRandomButtonSound() {
  if (BUTTON_SOUNDS.length === 0) return

  const src = BUTTON_SOUNDS[Math.floor(Math.random() * BUTTON_SOUNDS.length)]
  const audio = new Audio(src)
  void audio.play().catch(() => {})
}
