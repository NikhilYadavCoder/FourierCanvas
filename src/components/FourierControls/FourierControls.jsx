import styles from './FourierControls.module.css'

export default function FourierControls({ ready }) {
  return (
    <section className="card">
      <p className="section-title">3 — Fourier Controls</p>

      <div className={styles.grid}>
        <label className={styles.label}>
          Coefficients
          <input type="range" min="1" max="500" defaultValue="100" disabled={!ready} />
        </label>

        <label className={styles.label}>
          Speed
          <input type="range" min="1" max="10" defaultValue="3" disabled={!ready} />
        </label>
      </div>

      <div className={styles.toggleRow}>
        <label className={styles.toggle}>
          <input type="checkbox" defaultChecked disabled={!ready} />
          Show epicycles
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" defaultChecked disabled={!ready} />
          Show trace
        </label>
      </div>

      <div className={styles.btnRow}>
        <button className="btn-primary" disabled={!ready}>Play</button>
        <button className="btn-ghost"   disabled={!ready}>Pause</button>
        <button className="btn-ghost"   disabled={!ready}>Reset</button>
      </div>
    </section>
  )
}
