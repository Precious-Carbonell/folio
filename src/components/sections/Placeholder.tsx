import styles from './Placeholder.module.css'

type PlaceholderProps = {
  id: string
  label: string
  color: string
}

function Placeholder({ id, label, color }: PlaceholderProps) {
  return (
    <section
      id={id}
      className={styles.section}
      style={{ backgroundColor: color }}
    >
      <span className={styles.label}>{label}</span>
    </section>
  )
}

export default Placeholder
