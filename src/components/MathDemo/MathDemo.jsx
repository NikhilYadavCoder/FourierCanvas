import { useState, useEffect, useRef } from 'react'
import { computeDFT } from '../../math/dft.js'
import { generateCircle, generateSquare, generateTriangle } from '../../math/testShapes.js'
import styles from './MathDemo.module.css'

const SHAPES = {
  circle:   () => generateCircle(256, 150),
  square:   () => generateSquare(256, 270),
  triangle: () => generateTriangle(256, 155),
}

const W = 420  // canvas width / height

export default function MathDemo() {
  const canvasRef = useRef(null)
  // animState holds mutable animation data without triggering re-renders
  const animState = useRef({ coefs: [], t: 0, path: [], N: 256 })
  const rafId     = useRef(null)

  const [shape,    setShape]    = useState('circle')
  const [numCoefs, setNumCoefs] = useState(10)
  const [speed,    setSpeed]    = useState(2)
  const [tableRows, setTableRows] = useState([])

  // ── Recompute DFT when shape changes ───────────────────────
  useEffect(() => {
    const pts  = SHAPES[shape]()
    const coefs = computeDFT(pts)

    setTableRows(coefs.slice(0, 10))

    // Reset animation cleanly
    animState.current = { coefs, t: 0, path: [], N: pts.length }
  }, [shape])

  // ── Animation loop ──────────────────────────────────────────
  // Restarts when numCoefs or speed changes so the closure stays fresh.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function frame() {
      const { coefs, N } = animState.current
      if (!coefs.length) { rafId.current = requestAnimationFrame(frame); return }

      // Use only the top `numCoefs` coefficients (sorted by amplitude already)
      const slice = coefs.slice(0, numCoefs)

      // ── Clear ────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, W)
      ctx.fillStyle = '#0a0a0c'
      ctx.fillRect(0, 0, W, W)

      // ── Epicycles ────────────────────────────────────────────
      // Start at canvas center — this is the "origin" of our coordinate system
      let x = W / 2
      let y = W / 2

      for (const c of slice) {
        const prevX = x
        const prevY = y

        // The angle of this rotating vector at the current time:
        //   2π · freq · t / N  → full rotations per cycle
        //   + phase             → where it starts
        const angle = (2 * Math.PI * c.freq * animState.current.t) / N + c.phase
        x += c.amp * Math.cos(angle)
        y += c.amp * Math.sin(angle)

        // Draw the orbit circle (shows the radius of this epicycle)
        ctx.beginPath()
        ctx.arc(prevX, prevY, c.amp, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(108, 99, 255, 0.22)'
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Draw the vector arm from center of this circle to its tip
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = 'rgba(139, 133, 255, 0.85)'
        ctx.lineWidth = 1.3
        ctx.stroke()

        // Dot at tip
        ctx.beginPath()
        ctx.arc(x, y, 2.5, 0, 2 * Math.PI)
        ctx.fillStyle = '#6c63ff'
        ctx.fill()
      }

      // ── Trace ────────────────────────────────────────────────
      // The endpoint (x, y) traces out the reconstructed shape over time
      animState.current.path.push({ x, y })
      // Keep only one full cycle worth of points
      if (animState.current.path.length > N) animState.current.path.shift()

      const path = animState.current.path
      if (path.length > 1) {
        ctx.beginPath()
        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y)
        ctx.strokeStyle = '#ff6b6b'
        ctx.lineWidth = 1.8
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      // ── Advance time ─────────────────────────────────────────
      animState.current.t += speed
      if (animState.current.t >= N) {
        animState.current.t = 0
        animState.current.path = []
      }

      rafId.current = requestAnimationFrame(frame)
    }

    rafId.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId.current)
  }, [numCoefs, speed])

  return (
    <section className={`card ${styles.demo}`}>
      <p className="section-title">DFT Playground — understand the math before using it</p>

      {/* ── Shape selector ── */}
      <div className={styles.shapeRow}>
        {Object.keys(SHAPES).map(s => (
          <button
            key={s}
            className={shape === s ? 'btn-primary' : 'btn-ghost'}
            onClick={() => setShape(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Sliders ── */}
      <div className={styles.sliderRow}>
        <label className={styles.sliderLabel}>
          <span>Coefficients: <strong>{numCoefs}</strong></span>
          <input
            type="range" min="1" max="128" value={numCoefs}
            onChange={e => setNumCoefs(Number(e.target.value))}
          />
        </label>
        <label className={styles.sliderLabel}>
          <span>Speed: <strong>{speed}</strong></span>
          <input
            type="range" min="1" max="8" value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          />
        </label>
      </div>

      {/* ── Canvas + table ── */}
      <div className={styles.body}>
        <canvas
          ref={canvasRef}
          width={W}
          height={W}
          className={styles.canvas}
          aria-label="Epicycle animation"
        />

        <div className={styles.tableWrap}>
          <p className={styles.tableTitle}>Top 10 Fourier coefficients</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Freq k</th>
                <th>Amplitude</th>
                <th>Phase (rad)</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((c, i) => (
                <tr key={i} className={i < numCoefs ? styles.active : styles.inactive}>
                  <td>{i + 1}</td>
                  <td>{c.freq}</td>
                  <td>{c.amp.toFixed(2)}</td>
                  <td>{c.phase.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.hint}>
            Rows highlighted in purple are currently drawn.<br />
            Drag the Coefficients slider to add or remove them.
          </p>
        </div>
      </div>
    </section>
  )
}
