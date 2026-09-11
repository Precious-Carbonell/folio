import styles from './Section4.module.css'
import sec4Video from '../../assets/section4/sec4.mp4'

function Section4() {
  return (
    <section id="section-4" className={styles.section}>
      <video
        className={styles.video}
        src={sec4Video}
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  )
}

export default Section4
