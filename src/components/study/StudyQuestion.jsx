import React, { useState, useEffect, useRef } from 'react'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { Send, Mic, MicOff, Info, Check, HelpCircle } from 'lucide-react'

export default function StudyQuestion({ questionData, currentQ, totalQ, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [textAnswer, setTextAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)

  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput()
  const savedTextRef = useRef('')

  useEffect(() => {
    if (isListening && transcript) {
      const base = savedTextRef.current
      setTextAnswer(base + (base ? ' ' : '') + transcript)
    }
  }, [transcript, isListening])

  useEffect(() => {
    setSelectedOption('')
    setTextAnswer('')
    setShowHint(false)
    setHintUsed(false)
  }, [currentQ, questionData])

  if (!questionData) return null

  const { question, format, options, hint, difficulty } = questionData
  const isMcq = (format === 'mcq' || (Array.isArray(options) && options.length > 0)) && format !== 'true_false'
  const isTrueFalse = format === 'true_false'

  const handleToggleMic = () => {
    if (isListening) {
      stopListening()
    } else {
      savedTextRef.current = textAnswer
      resetTranscript()
      startListening()
    }
  }

  const handleFormSubmit = (e) => {
    e?.preventDefault()
    if (isListening) stopListening()

    const finalAns = isMcq || isTrueFalse ? selectedOption : textAnswer
    if (!finalAns.trim()) return

    onSubmit({
      answer: finalAns,
      hintUsed
    })
  }

  const progressPct = ((currentQ + 1) / totalQ) * 100

  return (
    <div className="animate-in max-w-2xl mx-auto space-y-4">
      {/* Top Header & Purple Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-purple-300 font-semibold px-1">
          <span>Question {currentQ + 1} of {totalQ}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            {difficulty || 'Medium'}
          </span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass rounded-3xl p-7 border border-white/10 shadow-2xl">
        <h2 className="text-xl font-semibold text-white leading-relaxed mb-6">{question}</h2>

        {/* MCQ 2x2 Grid */}
        {isMcq && Array.isArray(options) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedOption(opt)}
                className={`p-4 rounded-2xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                  selectedOption === opt
                    ? 'bg-purple-500/25 border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/15'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === opt && <Check size={16} className="text-purple-400 shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        )}

        {/* True / False Format */}
        {isTrueFalse && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {['True ✓', 'False ✗'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedOption(val)}
                className={`p-5 rounded-2xl text-sm font-bold text-center border transition-all ${
                  selectedOption === val
                    ? 'bg-purple-500/25 border-purple-500/50 text-white shadow-lg'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/15'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        )}

        {/* Text Area for Short Answer */}
        {!isMcq && !isTrueFalse && (
          <div className="relative mb-6">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your explanation or answer here..."
              rows={5}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/40 resize-none"
            />
            {isSupported && (
              <button
                type="button"
                onClick={handleToggleMic}
                className={`absolute right-3 top-3 p-2 rounded-xl transition-all ${
                  isListening ? 'bg-red-500/20 text-red-400 mic-active' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
        )}

        {/* Hint Section */}
        {hint && (
          <div className="mb-6">
            {!showHint ? (
              <button
                type="button"
                onClick={() => {
                  setShowHint(true)
                  setHintUsed(true)
                }}
                className="text-xs text-purple-400/80 hover:text-purple-300 flex items-center gap-1.5 font-medium transition-colors"
              >
                <HelpCircle size={14} />
                <span>Show Hint 💡 (Deducts 1 score point)</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs flex items-start gap-2 animate-in">
                <Info size={16} className="text-purple-400 mt-0.5 shrink-0" />
                <span>{hint}</span>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleFormSubmit}
          disabled={isMcq || isTrueFalse ? !selectedOption : !textAnswer.trim()}
          className="w-full btn-primary py-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-40"
        >
          <span>Submit Answer</span>
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
