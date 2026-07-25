import { useState } from 'react'
import { generateFlashcards } from '../../services/smartnotes'
import { RotateCw, ChevronLeft, ChevronRight, Check, X, Sparkles, Loader2, Trophy } from 'lucide-react'

export default function FlashcardDeck({ docText }) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardStatus, setCardStatus] = useState({}) // { [idx]: 'gotIt' | 'review' }

  const handleGenerate = async () => {
    if (!docText) return
    setLoading(true)
    try {
      const res = await generateFlashcards(docText)
      setCards(res)
      setCurrentIdx(0)
      setIsFlipped(false)
      setCardStatus({})
    } catch (err) {
      console.warn('Flashcards generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center animate-in">
        <Loader2 className="animate-spin text-purple-400 mb-4" size={32} />
        <p className="text-sm font-semibold text-white mb-1">Crafting Smart Flashcards...</p>
        <p className="text-xs text-slate-400">Creating 10-15 conceptual flashcards from your notes.</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="glass rounded-3xl p-10 text-center animate-in">
        <RotateCw className="mx-auto mb-3 text-purple-400/60" size={36} />
        <h3 className="text-lg font-bold text-white mb-1">No Flashcards Generated</h3>
        <p className="text-xs text-slate-400 mb-6">Click below to generate 3D interactive flashcards from your uploaded document.</p>
        <button
          onClick={handleGenerate}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Sparkles size={14} />
          <span>Generate Flashcard Deck</span>
        </button>
      </div>
    )
  }

  const currentCard = cards[currentIdx]
  const totalCards = cards.length
  const gotItCount = Object.values(cardStatus).filter(s => s === 'gotIt').length
  const progressPct = Math.round((Object.keys(cardStatus).length / totalCards) * 100)

  const handleMark = (status) => {
    setCardStatus(prev => ({ ...prev, [currentIdx]: status }))
    if (currentIdx < totalCards - 1) {
      setIsFlipped(false)
      setCurrentIdx(prev => prev + 1)
    }
  }

  return (
    <div className="animate-in max-w-xl mx-auto space-y-6">
      {/* Top Progress */}
      <div className="glass rounded-2xl p-4 flex items-center justify-between text-xs border border-white/5">
        <span className="text-slate-400">Progress: <strong className="text-white">{gotItCount}/{totalCards} Mastered</strong></span>
        <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 cursor-pointer perspective-1000 group"
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front of Card */}
          <div className="absolute inset-0 w-full h-full glass rounded-3xl p-8 border border-purple-500/30 backface-hidden flex flex-col justify-between text-center bg-[#1e293b] shadow-2xl">
            <div className="flex items-center justify-between text-[11px] text-purple-400 uppercase tracking-wider font-semibold">
              <span>{currentCard?.category || 'Question'}</span>
              <span>Card {currentIdx + 1} of {totalCards}</span>
            </div>
            <p className="text-lg font-semibold text-white leading-relaxed my-auto">
              {currentCard?.front}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <RotateCw size={12} /> Click to flip card
            </p>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 w-full h-full glass rounded-3xl p-8 border border-purple-500/50 backface-hidden rotate-y-180 flex flex-col justify-between text-center bg-[#2d1b69] shadow-2xl">
            <div className="flex items-center justify-between text-[11px] text-purple-300 uppercase tracking-wider font-semibold">
              <span>Answer / Concept</span>
              <span>Card {currentIdx + 1} of {totalCards}</span>
            </div>
            <p className="text-base text-slate-100 leading-relaxed my-auto">
              {currentCard?.back}
            </p>
            <p className="text-[11px] text-purple-300/60 flex items-center justify-center gap-1">
              <RotateCw size={12} /> Click to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            setIsFlipped(false)
            setCurrentIdx(prev => Math.max(0, prev - 1))
          }}
          disabled={currentIdx === 0}
          className="p-3 rounded-2xl glass border border-white/10 text-slate-400 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => handleMark('review')}
            className={`px-5 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              cardStatus[currentIdx] === 'review' ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-white/5 border-white/10 text-slate-300 hover:border-red-500/30'
            }`}
          >
            <X size={16} />
            <span>Review Again</span>
          </button>

          <button
            onClick={() => handleMark('gotIt')}
            className={`px-5 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              cardStatus[currentIdx] === 'gotIt' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-300 hover:border-emerald-500/30'
            }`}
          >
            <Check size={16} />
            <span>Got It</span>
          </button>
        </div>

        <button
          onClick={() => {
            setIsFlipped(false)
            setCurrentIdx(prev => Math.min(totalCards - 1, prev + 1))
          }}
          disabled={currentIdx === totalCards - 1}
          className="p-3 rounded-2xl glass border border-white/10 text-slate-400 hover:text-white disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
