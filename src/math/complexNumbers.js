/**
 * Complex number arithmetic
 *
 * We represent every 2D point (x, y) as a complex number:
 *   z = x + iy
 *
 * In code: { re: x, im: y }
 *
 * Why complex numbers for 2D points?
 *   Because multiplication by e^(iθ) rotates the point by θ.
 *   That is exactly what a Fourier epicycle does: rotate a vector.
 */

// ── Basic arithmetic ──────────────────────────────────────────

export function add(a, b) {
  return { re: a.re + b.re, im: a.im + b.im }
}

export function sub(a, b) {
  return { re: a.re - b.re, im: a.im - b.im }
}

/**
 * Complex multiplication: (a + bi)(c + di)
 *   real part:      ac - bd
 *   imaginary part: ad + bc
 *
 * Geometrically: multiplies magnitudes and adds angles.
 * So multiplying any z by a unit complex number rotates z.
 */
export function mul(a, b) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }
}

export function scale(z, s) {
  return { re: z.re * s, im: z.im * s }
}

// ── Polar form ────────────────────────────────────────────────

/**
 * Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)
 *
 * This is the most important identity in Fourier analysis.
 * It says: a unit complex number at angle θ is a point on the
 * unit circle. As θ increases, the point rotates around the origin.
 *
 * That is exactly a rotating vector — an epicycle arm.
 */
export function euler(theta) {
  return { re: Math.cos(theta), im: Math.sin(theta) }
}

/**
 * Amplitude (magnitude): |z| = √(re² + im²)
 * This is the length of the vector — the epicycle radius.
 */
export function magnitude(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im)
}

/**
 * Phase (angle): arg(z) = atan2(im, re)
 * This is the starting angle of the rotating vector.
 */
export function phase(z) {
  return Math.atan2(z.im, z.re)
}

/** Convert polar to rectangular: amp * e^(i*phi) */
export function fromPolar(amp, phi) {
  return { re: amp * Math.cos(phi), im: amp * Math.sin(phi) }
}
