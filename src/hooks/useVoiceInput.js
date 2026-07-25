import { useState, useRef, useCallback } from 'react'

export function useVoiceInput() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null
  const isSupported = !!SpeechRecognition

  const startListening = useCallback(() => {
    if (!isSupported || isListening) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let finalText = ''
    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' '
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setTranscript(finalText + interim)
    }

    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  const resetTranscript = useCallback(() => setTranscript(''), [])

  return { transcript, isListening, startListening, stopListening, resetTranscript, isSupported }
}
