import styles from './NavButton.module.css'
import nav1 from '../../assets/herosection/navbar/nav1.png'
import nav2 from '../../assets/herosection/navbar/nav2.png'
import nav3 from '../../assets/herosection/navbar/navbar3.png'

type NavButtonProps = {
  onClick?: () => void
  /** 'main' shows nav1 (hover nav2); 'menu' shows nav3 on the menu page. */
  variant?: 'main' | 'menu'
}

function NavButton({ onClick, variant = 'main' }: NavButtonProps) {
  const baseSrc = variant === 'menu' ? nav3 : nav1
  const hoverSrc = variant === 'menu' ? nav3 : nav2

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={onClick}
        aria-label={variant === 'menu' ? 'Back to home' : 'Open navigation'}
      >
        <img
          src={baseSrc}
          alt=""
          aria-hidden="true"
          className={`${styles.img} ${styles.imgBase}`}
        />
        <img
          src={hoverSrc}
          alt=""
          aria-hidden="true"
          className={`${styles.img} ${styles.imgHover}`}
        />
      </button>
    </div>
  )
}

export default NavButton
