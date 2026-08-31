import { useState, useRef, useEffect } from 'react'
import styles from './Section2.module.css'
import bg from '../../assets/section2/section2.png'
import sec2Yap from '../../assets/section2/sec3yap.mp3'
import item1 from '../../assets/section2/item1.png'
import item2 from '../../assets/section2/item2.png'
import item3 from '../../assets/section2/item3.png'
import item4 from '../../assets/section2/item4.png'
import item5 from '../../assets/section2/item5.png'
import item6 from '../../assets/section2/item6.png'
import ItemModal, { type Item } from './ItemModal'
import AboutMeAnimation from './AboutMeAnimation'
import { playHoverSound } from '../../lib/buttonSound'

// Each desk item, its image, and a short description shown in the modal.
const ITEMS: (Item & { className: string })[] = [
  {
    image: item1,
    description: 'A polaroid of My Little Pony and another suspucious photograph.',
    className: 'item1',
  },
  {
    image: item2,
    description: 'Her lanyard showcasing her age and course in university.',
    className: 'item2',
  },
  {
    image: item3,
    description: 'An empty journal.',
    className: 'item3',
  },
  {
    image: item4,
    description: 'A computer locked with a 4-pin password. Hint: My nickname in korean.',
    className: 'item4',
  },
  {
    image: item5,
    description: 'Hadestown - Epic III casette.',
    className: 'item5',
  },
  {
    image: item6,
    description: 'Sailor Moon Luna Keychain.',
    className: 'item6',
  },
]

type Section2Props = {
  active?: boolean
}

function Section2({ active = false }: Section2Props) {
  const [activeItem, setActiveItem] = useState<Item | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play sec3yap.mp3 after this room has been active for 2 seconds.
  useEffect(() => {
    if (!active) return

    if (!audioRef.current) {
      audioRef.current = new Audio(sec2Yap)
    }
    const audio = audioRef.current

    const timer = window.setTimeout(() => {
      audio.currentTime = 0
      void audio.play().catch(() => {})
    }, 2000)

    // Leaving the room before 2s cancels it; leaving after stops playback.
    return () => {
      clearTimeout(timer)
      audio.pause()
    }
  }, [active])

  return (
    <section
      id="section-2"
      className={styles.section}
      style={{ '--section2-bg': `url(${bg})` } as React.CSSProperties}
    >
      {ITEMS.map((item, i) => (
        <img
          key={i}
          src={item.image}
          alt=""
          className={`${styles.item} ${styles[item.className]}`}
          onMouseEnter={playHoverSound}
          onClick={() => setActiveItem(item)}
        />
      ))}

      <AboutMeAnimation />

      {activeItem && (
        <ItemModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </section>
  )
}

export default Section2
