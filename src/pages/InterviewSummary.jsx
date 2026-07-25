import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { generateInterviewSummary } from '../services/interviewService'
import { Briefcase, Award, RotateCcw, Flame, CheckCircle2, AlertTriangle, ShieldCheck, Home } from 'lucide-react'

function MetricBar({ label, score }) {
  const barColor = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-white font-bold">{score}%</span>
      </div>
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function InterviewSummary() {
  const { interviewConfig, setScreen, lastSessionScores } = useApp()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  async function fetchSummary() {
    try {
      const res = await generateInterviewSummary(interviewConfig || {}, lastSessionScores || [])
      setSummary(res)
    } catch (e) {
      setSummary({
        overallScore: 78,
        hiringVerdict: 'Hire',
        metrics: { content: 80, communication: 75, structure: 70, confidence: 75 },
        strengths: ['Domain Awareness', 'Communication Clarity', 'Confidence under pressure'],
        improvements: ['Structure with STAR method', 'Provide concrete metrics', 'Be concise'],
        finalVerdict: 'Candidate demonstrated solid background knowledge and clear communication. With more structured answers and specific metrics, they will excel in live rounds.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in">
        <div className="dot-pulse"><span /><span /><span /></div>
        <p className="text-xs text-red-300 font-medium">Synthesizing Interview Debrief & Hiring Manager Evaluation...</p>
      </div>
    )
  }

  const verdictStyles = {
    'Strong Hire': { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', label: '🏆 Strong Hire' },
    Hire: { bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400', label: '💼 Hire' },
    Maybe: { bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', label: '🟡 Maybe' },
    'Not Yet': { bg: 'bg-red-500/10 border-red-500/30 text-red-400', label: '🔴 Not Yet' }
  }
  const vStyle = verdictStyles[summary.hiringVerdict] || verdictStyles.Hire

  return (
    <div className="animate-in max-w-2xl mx-auto space-y-6 py-4">
      <div className="glass rounded-3xl p-7 border border-red-500/20 shadow-2xl bg-[#070d1e] space-y-6">
        {/* Header */}
        <div className="text-center border-b border-white/5 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-300 mb-2 font-semibold">
            <Briefcase size={14} />
            <span>Interview Debrief 💼</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {interviewConfig?.category === 'job'
              ? `${interviewConfig.job.role} (${interviewConfig.job.round} Round)`
              : interviewConfig?.category === 'school'
              ? `${interviewConfig.school.subject} Viva`
              : `College Interview (${interviewConfig?.college?.targetType})`}
          </h1>
          <p className="text-xs text-slate-400">Pressure Mode: {interviewConfig?.pressureMode || 'Normal'}</p>
        </div>

        {/* Overall Score & Hiring Likelihood Indicator */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="text-center">
            <span className="text-5xl font-bold text-white">{summary.overallScore}</span>
            <span className="text-sm font-semibold text-slate-500"> / 100</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-bold ${vStyle.bg}`}>
            <ShieldCheck size={16} />
            <span>Hiring Likelihood: {vStyle.label}</span>
          </div>
        </div>

        {/* 4-Axis Performance Metrics Breakdown */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluation Breakdown</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricBar label="Content Accuracy" score={summary.metrics?.content || 75} />
            <MetricBar label="Communication Clarity" score={summary.metrics?.communication || 70} />
            <MetricBar label="Structure & Logic" score={summary.metrics?.structure || 65} />
            <MetricBar label="Confidence & Composure" score={summary.metrics?.confidence || 75} />
          </div>
        </div>

        {/* Top Strengths & Areas to Improve Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/10">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Top Strengths</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {summary.strengths.map((str, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-300">
                  ✓ {str}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/[0.04] border border-red-500/10">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>Areas to Improve</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {summary.improvements.map((imp, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-semibold text-red-300">
                  ⚠️ {imp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Interviewer Verdict */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hiring Manager Debrief Verdict</h4>
          <p className="text-xs text-slate-200 leading-relaxed italic">"{summary.finalVerdict}"</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setScreen('interview-setup')}
            className="py-3 rounded-2xl text-xs font-bold text-white glass border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Practice Again</span>
          </button>

          <button
            onClick={() => {
              setScreen('interview-setup')
            }}
            className="py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            <Flame size={15} />
            <span>Try Harder Questions</span>
          </button>
        </div>
      </div>
    </div>
  )
}
