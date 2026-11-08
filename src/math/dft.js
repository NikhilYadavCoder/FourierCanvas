import { mul, add, euler, magnitude, phase } from './complexNumbers.js'

/**
 * Discrete Fourier Transform
 *
 * Given N complex points x[0], x[1], ..., x[N-1] representing a closed path,
 * this computes N Fourier coefficients X[0], X[1], ..., X[N-1].
 *
 * Formula:
 *   X[k] = Σ_{n=0}^{N-1}  x[n] · exp(-i · 2π · k · n / N)
 *
 * What each part means:
 *   x[n]  — the nth point on the path, as a complex number { re, im }
 *   k     — the frequency index (how many full rotations per cycle)
 *   n     — the sample index (which point we're at)
 *   N     — total number of points
 *   exp(-i·2π·k·n/N) — a rotating unit vector; it "tests" how much of
 *                       frequency k is present in the signal at sample n
 *
 * The result X[k] is a complex number whose:
 *   - magnitude |X[k]|/N  → the amplitude of the kth rotating arm (epicycle radius)
 *   - angle arg(X[k])     → the starting phase of that arm
 *   - index k             → the rotation speed (frequency)
 *
 * Time complexity: O(N²) — straightforward but sufficient for N ≤ 2000.
 * (A Fast Fourier Transform runs in O(N log N), but is harder to explain.)
 */
export function computeDFT(points) {
  const N = points.length
  const result = []

  for (let k = 0; k < N; k++) {
    let sum = { re: 0, im: 0 }

    for (let n = 0; n < N; n++) {
      // The twiddle factor: a unit vector rotating at frequency k, sample n
      // We use -2π (negative) because DFT convention "unwinds" the rotation
      const angle = -2 * Math.PI * k * n / N
      const twiddle = euler(angle)          // cos(angle) + i·sin(angle)
      const term = mul(points[n], twiddle)  // project x[n] onto this frequency
      sum = add(sum, term)
    }

    // Normalize by N so each amplitude is on the same scale as the input
    const re = sum.re / N
    const im = sum.im / N

    // Centered frequency:
    //   Raw k=0..N-1 maps to freq=0,1,..,N/2,-N/2+1,..,-1
    //   This makes "spin left" and "spin right" explicit
    const freq = k <= N / 2 ? k : k - N

    result.push({
      freq,
      amp:   magnitude({ re, im }),
      phase: phase({ re, im }),
      re,
      im,
    })
  }

  // Sort largest amplitude first → biggest epicycles drawn first
  // This matters visually: large arms define the rough shape,
  // small arms add fine detail.
  result.sort((a, b) => b.amp - a.amp)

  return result
}
