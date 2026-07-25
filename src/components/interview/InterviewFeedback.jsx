import React from 'react'
import { Star, AlertTriangle, Briefcase, Target, ArrowRight, BarChart3, CheckCircle2, XCircle } from 'lucide-react'

function MetricBar({ label, value, max = 10 }) {
  const pct = Math.round((value / max) * 100)
  const barColor = value >= 8 ? 'bg-emerald-400' : value >= 6 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-white font-bold">{value}/{max}</span>
      </div>
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// star check only makes sense for HR questions, skip for technical
function StarFormatCheck({ starCheck }) {
  if (!starCheck) return null

  const items = [
    { key: 'situation', label: 'Situation' },
    { key: 'task', label: 'Task' },
    { key: 'action', label: 'Action' },
    { key: 'result', label: 'Result' },
  ]

  return (
    <div className="mb-4 p-4 rounded-2xl bg-[#0a1128] border border-blue-500/20">
      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <BarChart3 size={14} />
        <span>STAR Format Structural Check</span>
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ key, label }) => {
          const isPassed = !!starCheck[key]
          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              {isPassed ? (
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              ) : (
                <XCircle size={14} className="text-red-400 shrink-0" />
              )}
              <span className={isPassed ? 'text-slate-200' : 'text-slate-400'}>
                {label}: <strong className={isPassed ? 'text-emerald-400' : 'text-red-400'}>{isPassed ? 'Included' : 'Missing'}</strong>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function InterviewFeedback({ feedback, currentQ, totalQ, onNext }) {
  if (!feedback) return null

  const {
    overallScore, contentAccuracy, communication, structureClarity,
    whatImpressed, whatWeakened, idealAnswerStructure, interviewTip,
    starCheck, verdictLine
  } = feedback

  const isLast = currentQ >= totalQ - 1

  return (
    <div className="animate-in max-w-2xl mx-auto space-y-4">
      <div className="glass rounded-3xl p-7 border border-red-500/20 shadow-2xl bg-[#070d1e]">
        {/* Interviewer Verbal Verdict Header */}
        <div className="text-center mb-6 pb-5 border-b border-white/5">
          <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Interviewer Feedback</span>
          <h3 className="text-2xl font-bold text-white mt-1 mb-2">Overall Score: {overallScore}/10</h3>
          {verdictLine && (
            <p className="text-xs text-slate-300 italic max-w-md mx-auto">"{verdictLine}"</p>
          )}
        </div>

        {/* 3 Metric Breakdown Bars */}
        <div className="space-y-3 mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <MetricBar label="Content Accuracy" value={contentAccuracy || 7} />
          <MetricBar label="Communication Clarity" value={communication || 7} />
          <MetricBar label="Structure & Logic" value={structureClarity || 6} />
        </div>

        {/* STAR Format Check for HR Questions */}
        <StarFormatCheck starCheck={starCheck} />

        {/* What Impressed */}
        <div className="mb-3.5 p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-1.5">
            <Star size={16} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">What Impressed the Interviewer</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{whatImpressed}</p>
        </div>

        {/* What Weakened */}
        <div className="mb-3.5 p-4 rounded-2xl bg-red-500/[0.04] border border-red-500/10">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle size={16} className="text-red-400" />
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">What Weakened Your Answer</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{whatWeakened}</p>
        </div>

        {/* How a Top Candidate Would Answer */}
        {idealAnswerStructure && (
          <div className="mb-3.5 p-4 rounded-2xl bg-purple-500/[0.04] border border-purple-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Briefcase size={16} className="text-purple-400" />
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">How a Top Candidate Would Answer</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">{idealAnswerStructure}</p>
          </div>
        )}

        {/* Interview Tip */}
        {interviewTip && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Target size={16} className="text-amber-400" />
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Actionable Interview Tip</h3>
            </div>
            <p className="text-slate-200 text-xs font-medium">{interviewTip}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onNext}
          className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
        >
          {isLast ? (
            <>
              <BarChart3 size={16} />
              <span>View Interview Debrief Summary</span>
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
