import { useRef } from 'react'
import styles from './DrawingCanvas.module.css'

export default function DrawingCanvas({ ready }) {
  const canvasRef = useRef(null)

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'fourier-portrait.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <section className="card">
      <p className="section-title">4 — Drawing</p>

      <div className={styles.canvasWrap}>
        {ready
          ? <canvas ref={canvasRef} width={600} height={600} className={styles.canvas} />
          : <p className={styles.placeholder}>Process an image to start the animation.</p>
        }
      </div>

      <div className={styles.footer}>
        <span className={styles.progress}>Progress: —</span>
        <button className="btn-ghost" disabled={!ready} onClick={handleDownload}>
          Download PNG
        </button>
      </div>
    </section>
  )
}
