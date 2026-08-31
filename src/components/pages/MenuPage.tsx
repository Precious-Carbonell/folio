import styles from './MenuPage.module.css'
import menuBg from '../../assets/herosection/navbar/navbarbg.jpg'
import { playRandomButtonSound } from '../../lib/buttonSound'
import Stars from './Stars'

// Each menu label maps to a section id on the main page.
const MENU_ITEMS = [
  { label: 'Home', target: 'hero' },
  { label: 'About Me', target: 'section-2' },
  { label: 'Projects', target: 'section-3' },
  { label: 'Contact', target: 'section-4' },
] as const

type MenuPageProps = {
  onSelect?: (targetId: string) => void
}

function MenuPage({ onSelect }: MenuPageProps) {
  return (
    <div
      className={styles.page}
      style={{ '--menu-bg': `url(${menuBg})` } as React.CSSProperties}
    >
      <Stars />

      <nav className={styles.menu}>
        {MENU_ITEMS.map(({ label, target }) => (
          <button
            key={label}
            type="button"
            className={styles.link}
            onClick={() => {
              playRandomButtonSound()
              onSelect?.(target)
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default MenuPage
