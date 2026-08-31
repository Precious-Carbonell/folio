import { useEffect } from 'react'
import styles from './TransitionOverlay.module.css'
import transitionImg from '../../assets/herosection/navbar/transition.png'

const DURATION_MS = 700

type TransitionOverlayProps = {
  /** Called when the screen is fully white — swap the page here. */
  onComplete: () => void
}

function TransitionOverlay({ onComplete }: TransitionOverlayProps) {
  useEffect(() => {
    const id = window.setTimeout(onComplete, DURATION_MS)
    return () => clearTimeout(id)
  }, [onComplete])

  return (
    <div className={styles.overlay}>
      <div className={styles.flash} />
      <img src={transitionImg} alt="" aria-hidden="true" className={styles.image} />
    </div>
  )
}

export default TransitionOverlay
