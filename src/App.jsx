import { useState } from 'react'
import Header from './components/Header/Header'
import MathDemo from './components/MathDemo/MathDemo'
import Upload from './components/Upload/Upload'
import Processing from './components/Processing/Processing'
import FourierControls from './components/FourierControls/FourierControls'
import DrawingCanvas from './components/DrawingCanvas/DrawingCanvas'
import styles from './App.module.css'

export default function App() {
  const [imageFile, setImageFile] = useState(null)
  const [processedReady, setProcessedReady] = useState(false)

  function handleImageLoaded(file) {
    setImageFile(file)
    setProcessedReady(false)
  }

  function handleProcess() {
    // Real OpenCV pipeline comes in Stage 4
    console.log('Processing image:', imageFile?.name)
    setProcessedReady(true)
  }

  return (
    <div className={styles.appShell}>
      <Header />

      {/* ── Learning section: DFT on simple shapes ── */}
      <MathDemo />

      {/* ── Main workflow ── */}
      <main className={styles.main}>
        <div className={styles.leftCol}>
          <Upload onImageLoaded={handleImageLoaded} />
          <Processing
            imageReady={!!imageFile}
            onProcess={handleProcess}
          />
          <FourierControls ready={processedReady} />
        </div>

        <div className={styles.rightCol}>
          <DrawingCanvas ready={processedReady} />
        </div>
      </main>
    </div>
  )
}
