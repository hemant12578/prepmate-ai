import { useState, useEffect, useRef } from 'react'

export function useAudioOverview() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(0)
  const [rate, setRate] = useState(1.0)
  const [progress, setProgress] = useState(0)
  const utteranceRef = useRef(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!isSupported) return

    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices()
      // Filter for English voices if available
      const enVoices = avail.filter(v => v.lang.startsWith('en'))
      setVoices(enVoices.length > 0 ? enVoices : avail)
    }

    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
  }, [isSupported])

  const speak = (text) => {
    if (!isSupported || !text) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    if (voices[selectedVoice]) {
      utterance.voice = voices[selectedVoice]
    }
    utterance.rate = rate

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => {
      setIsPlaying(false)
      setProgress(100)
    }
    utterance.onerror = () => setIsPlaying(false)

    utterance.onboundary = (e) => {
      if (e.name === 'word' && text.length > 0) {
        const pct = Math.min(100, Math.round((e.charIndex / text.length) * 100))
        setProgress(pct)
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (!isSupported) return
    window.speechSynthesis.pause()
    setIsPlaying(false)
  }

  const resume = () => {
    if (!isSupported) return
    window.speechSynthesis.resume()
    setIsPlaying(true)
  }

  const stop = () => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setProgress(0)
  }

  // TODO: add word highlighting later

  return {
    isSupported,
    isPlaying,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    progress,
    speak,
    pause,
    resume,
    stop
  }
}
