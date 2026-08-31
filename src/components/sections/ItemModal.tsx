import { useEffect } from 'react'
import styles from './ItemModal.module.css'

export type Item = {
  image: string
  description: string
}

type ItemModalProps = {
  item: Item
  onClose: () => void
}

function ItemModal({ item, onClose }: ItemModalProps) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Stop clicks inside the dialog from closing it. */}
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className={styles.content}>
          <img src={item.image} alt="" className={styles.image} />
          <p className={styles.description}>{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export default ItemModal
