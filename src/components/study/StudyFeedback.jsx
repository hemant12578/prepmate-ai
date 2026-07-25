import React from 'react'
import { CheckCircle2, AlertTriangle, BookOpen, Lightbulb, ArrowRight, BarChart3, Sparkles } from 'lucide-react'

function ScoreRing({ score, size = 90, stroke = 6 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 10) * circumference
  const color = score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring"
          style={{ animation: 'drawRing 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-[10px] text-slate-500">/10</span>
      </div>
    </div>
  )
}

export default function StudyFeedback({ feedback, currentQ, totalQ, onNext }) {
  if (!feedback) return null

  const { score, whatYouGotRight, whatYouMissed, conceptExplanation, memoryTrick, studyThisNext, encouragement } = feedback
  const isLast = currentQ >= totalQ - 1

  return (
    <div className="animate-in max-w-2xl mx-auto space-y-4">
      <div className="glass rounded-3xl p-7 border border-purple-500/20 shadow-2xl">
        {/* Score & Encouragement */}
        <div className="flex flex-col items-center mb-6">
          <ScoreRing score={score} />
          <p className="text-purple-300 font-medium text-sm mt-3 text-center">{encouragement}</p>
        </div>

        {/* What You Got Right */}
        <div className="mb-3.5 p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">What You Got Right</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{whatYouGotRight}</p>
        </div>

        {/* What You Missed */}
        <div className="mb-3.5 p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/10">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">What You Missed</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{whatYouMissed}</p>
        </div>

        {/* Concept Explanation */}
        {conceptExplanation && (
          <div className="mb-3.5 p-4 rounded-2xl bg-purple-500/[0.04] border border-purple-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen size={16} className="text-purple-400" />
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Concept Explanation</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{conceptExplanation}</p>
          </div>
        )}

        {/* Memory Trick */}
        {memoryTrick && (
          <div className="mb-3.5 p-4 rounded-2xl bg-blue-500/[0.04] border border-blue-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb size={16} className="text-blue-400" />
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Memory Trick</h3>
            </div>
            <p className="text-slate-200 text-xs font-medium italic">{memoryTrick}</p>
          </div>
        )}

        {/* Study This Next */}
        {studyThisNext && (
          <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-purple-400" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study This Next</h3>
            </div>
            <p className="text-purple-300 text-xs font-medium">{studyThisNext}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onNext}
          className="w-full btn-primary py-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          {isLast ? (
            <>
              <BarChart3 size={16} />
              <span>View Study Session Summary</span>
            </>
          ) : (
            <>
              <span>Next Question ({currentQ + 2}/{totalQ})</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
