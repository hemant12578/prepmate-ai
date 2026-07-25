import { useState } from 'react'

// pdfjs needs this worker or it breaks
let pdfjsLib = null

async function loadPDFJS() {
  if (pdfjsLib) return pdfjsLib
  pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
  return pdfjsLib
}

export function usePDFExtract() {
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState(null)

  const extractTextFromPDF = async (file) => {
    setExtracting(true)
    setError(null)
    try {
      const lib = await loadPDFJS()
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''
      const numPages = pdf.numPages

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => item.str).join(' ')
        fullText += `--- Page ${i} ---\n` + pageText + '\n\n'
      }

      setExtracting(false)
      return {
        text: fullText.trim(),
        numPages,
        charCount: fullText.length
      }
    } catch (err) {
      console.warn('PDF extraction error:', err)
      setError('Could not extract text from PDF. Please check the file.')
      setExtracting(false)
      throw err
    }
  }

  return { extractTextFromPDF, extracting, error }
}
