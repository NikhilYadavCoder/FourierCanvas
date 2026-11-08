import { useRef, useState } from 'react'
import styles from './Upload.module.css'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 10

export default function Upload({ onImageLoaded }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  function validateAndLoad(file) {
    setError('')
    if (!file) return

    if (!ACCEPTED.includes(file.type)) {
      setError('Unsupported format. Please upload a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_MB} MB.`)
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    onImageLoaded?.(file, url)
  }

  function handleFiles(files) {
    if (files?.length) validateAndLoad(files[0])
  }

  function onInputChange(e) {
    handleFiles(e.target.files)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave() {
    setDragging(false)
  }

  function clearImage() {
    setPreview(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
    onImageLoaded?.(null, null)
  }

  return (
    <section className="card">
      <p className="section-title">1 — Upload Photo</p>

      {!preview ? (
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 16V4m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20h16" strokeLinecap="round"/>
          </svg>
          <p>Drag &amp; drop a photo here, or <span className={styles.link}>click to browse</span></p>
          <p className={styles.hint}>JPEG · PNG · WebP · max {MAX_MB} MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={onInputChange}
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <div className={styles.previewWrap}>
          <img src={preview} alt="Uploaded preview" className={styles.previewImg} />
          <button className="btn-ghost" onClick={clearImage}>Remove image</button>
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}
    </section>
  )
}
