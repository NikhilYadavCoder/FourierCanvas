/**
 * Test shape generators — Stage 2 learning tools.
 *
 * Before applying the DFT to real photos, we test it on shapes
 * whose Fourier decomposition we can predict mathematically.
 *
 * All shapes return an array of { re: x, im: y } complex points
 * representing one complete traversal of the perimeter.
 */

/**
 * Circle of radius R, sampled at N equally-spaced angles.
 *
 * z[n] = R · exp(i · 2π · n / N)
 *       = R·cos(2π·n/N) + i·R·sin(2π·n/N)
 *
 * Mathematical prediction:
 *   DFT coefficient at k=1 has amplitude = R, all others ≈ 0.
 *   This means ONE epicycle (of radius R) perfectly draws a circle.
 *   That is the simplest possible Fourier series.
 */
export function generateCircle(N = 256, R = 150) {
  const points = []
  for (let n = 0; n < N; n++) {
    const angle = (2 * Math.PI * n) / N
    points.push({ re: R * Math.cos(angle), im: R * Math.sin(angle) })
  }
  return points
}

/**
 * Square with side length `side`, sampled at N equally-spaced
 * perimeter positions (not equally-spaced in angle).
 *
 * Sharp corners require infinitely many Fourier terms.
 * In practice: use more coefficients → sharper corners.
 * With N coefficients the Gibbs phenomenon adds ~9% overshoot
 * near each corner regardless of how many terms are used.
 *
 * The Fourier series of a square contains only odd harmonics:
 * frequencies 1, 3, 5, 7, ... (even harmonics cancel by symmetry).
 */
export function generateSquare(N = 256, side = 280) {
  const points = []
  const half = side / 2
  const perimeter = side * 4

  for (let n = 0; n < N; n++) {
    const t = (n / N) * perimeter  // arc-length position along perimeter
    let x, y

    if (t < side) {
      // Bottom edge: left to right
      x = -half + t
      y = -half
    } else if (t < 2 * side) {
      // Right edge: bottom to top
      x = half
      y = -half + (t - side)
    } else if (t < 3 * side) {
      // Top edge: right to left
      x = half - (t - 2 * side)
      y = half
    } else {
      // Left edge: top to bottom
      x = -half
      y = half - (t - 3 * side)
    }

    points.push({ re: x, im: y })
  }
  return points
}

/**
 * Equilateral triangle with circumradius R.
 * Three vertices at angles -90°, 150°, 30° (pointing upward).
 *
 * Like the square, sharp corners need many harmonics.
 * Triangle has 3-fold rotational symmetry, so its Fourier series
 * contains only frequencies 1, 4, 7, 10, ... (multiples of 3 offset by 1).
 */
export function generateTriangle(N = 256, R = 160) {
  const points = []
  const vertices = [0, 1, 2].map(i => {
    const a = (2 * Math.PI * i) / 3 - Math.PI / 2
    return { x: R * Math.cos(a), y: R * Math.sin(a) }
  })

  for (let n = 0; n < N; n++) {
    const t    = (n / N) * 3     // position in [0, 3)
    const seg  = Math.floor(t)   // which edge (0, 1, 2)
    const frac = t - seg         // how far along that edge

    const a = vertices[seg]
    const b = vertices[(seg + 1) % 3]

    points.push({
      re: a.x + frac * (b.x - a.x),
      im: a.y + frac * (b.y - a.y),
    })
  }
  return points
}
