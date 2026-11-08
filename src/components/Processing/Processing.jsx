import styles from './Processing.module.css'

export default function Processing({ imageReady, onProcess }) {
  return (
    <section className="card">
      <p className="section-title">2 — Process Image</p>

      <div className={styles.row}>
        <label className={styles.label}>
          Threshold
          <input type="range" min="0" max="255" defaultValue="128" disabled={!imageReady} />
        </label>

        <label className={styles.label}>
          Resolution
          <select disabled={!imageReady} className={styles.select}>
            <option value="512">512 px</option>
            <option value="768">768 px</option>
            <option value="1024">1024 px</option>
          </select>
        </label>
      </div>

      <div className={styles.previewBox}>
        {imageReady
          ? <p className={styles.placeholder}>Contour preview will appear here after processing.</p>
          : <p className={styles.placeholder}>Upload an image first.</p>
        }
      </div>

      <button
        className="btn-primary"
        disabled={!imageReady}
        onClick={onProcess}
      >
        Process Image
      </button>
    </section>
  )
}
