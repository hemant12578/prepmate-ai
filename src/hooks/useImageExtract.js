import { useState } from 'react'
import Tesseract from 'tesseract.js'

export function useImageExtract() {
  const [extracting, setExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const extractTextFromImage = async (file) => {
    setExtracting(true)
    setProgress(0)
    setError(null)

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress) {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })

      const text = result.data?.text?.trim()
      if (!text || text.length < 5) {
        throw new Error('Could not recognize text from image. Please ensure the image contains legible text.')
      }

      setExtracting(false)
      return {
        text,
        charCount: text.length,
        confidence: Math.round(result.data.confidence || 85)
      }
    } catch (err) {
      console.warn('Image OCR extraction failed:', err)
      setError(err.message || 'Image text recognition failed.')
      setExtracting(false)
      throw err
    }
  }

  return { extractTextFromImage, extracting, progress, error }
}
