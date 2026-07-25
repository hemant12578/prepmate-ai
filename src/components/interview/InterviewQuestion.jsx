import React, { useState, useRef, useEffect } from 'react'
import PressureTimer from './PressureTimer'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import { UserCheck, Send, Mic, MicOff, Check } from 'lucide-react'

export default function InterviewQuestion({ questionData, currentQ, totalQ, pressureMode, onSubmit }) {
  const [textAnswer, setTextAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput()
  const savedTextRef = useRef('')

  useEffect(() => {
    if (isListening && transcript) {
      const base = savedTextRef.current
      setTextAnswer(base + (base ? ' ' : '') + transcript)
    }
  }, [transcript, isListening])

  if (!questionData) return null

  const { question, isHrQuestion, options } = questionData

  const handleToggleMic = () => {
    if (isListening) {
      stopListening()
    } else {
      savedTextRef.current = textAnswer
      resetTranscript()
      startListening()
    }
  }

  const handleFormSubmit = () => {
    if (isListening) stopListening()
    const finalAns = options ? selectedOption : textAnswer
    if (!finalAns.trim()) return
    onSubmit({ answer: finalAns, isHrQuestion })
  }

  const handleTimeUp = () => {
    if (isListening) stopListening()
    const finalAns = textAnswer.trim() || 'Candidate ran out of time before submitting response.'
    onSubmit({ answer: finalAns, isHrQuestion })
  }

  const tensionPct = ((currentQ + 1) / totalQ) * 100

  return (
    <div className="animate-in max-w-2xl mx-auto space-y-4">
      {/* Top Tension Indicator Line */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-red-400 uppercase tracking-wider px-1">
          <span>Question {currentQ + 1} of {totalQ}</span>
          <span>{pressureMode === 'Pressure' ? '🔴 Pressure Mode (90s)' : pressureMode === 'Normal' ? '🟡 Normal Round' : '🟢 Relaxed Viva'}</span>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${tensionPct}%` }} />
        </div>
      </div>

      {/* Pressure Mode Timer (90 seconds) */}
      {pressureMode === 'Pressure' && (
        <PressureTimer initialSeconds={90} onTimeUp={handleTimeUp} active={true} />
      )}

      {/* Interview Question Card */}
      <div className="glass rounded-3xl p-7 border border-red-500/20 shadow-2xl bg-[#070d1e]">
        {/* Interviewer Header */}
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
            <UserCheck size={14} />
          </div>
          <span>INTERVIEWER</span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg font-medium text-white leading-relaxed mb-6 tracking-wide font-sans">
          "{question}"
        </h2>

        {/* Options for MCQ Technical Questions */}
        {options && Array.isArray(options) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedOption(opt)}
                className={`p-4 rounded-2xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                  selectedOption === opt
                    ? 'bg-red-500/25 border-red-500/50 text-white shadow-lg'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/15'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === opt && <Check size={16} className="text-red-400 shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        ) : (
          /* Text area for HR & Technical open-ended questions */
          <div className="relative mb-6">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="State your answer clearly and structure your response..."
              rows={6}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500/40 resize-none"
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

        {/* Serious Dark Submit Button */}
        <button
          onClick={handleFormSubmit}
          disabled={options ? !selectedOption : !textAnswer.trim()}
          className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-40"
        >
          <span>Submit Answer</span>
          <Send size={14} />
        </button>

        <p className="text-[11px] text-slate-500 text-center mt-3">
          Tip: Structure your answer clearly. Take a breath before typing.
        </p>
      </div>
    </div>
  )
}
