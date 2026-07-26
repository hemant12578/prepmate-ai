import { useState } from 'react'
import { Sparkles, BookOpen, CheckSquare, Award, FileText, Loader2, AlertTriangle, RotateCw } from 'lucide-react'

export default function SummaryView({ summary, loading, onGenerate, error }) {
  const [checkedKeys, setCheckedKeys] = useState({})

  if (loading) {
    return (
      <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center animate-in">
        <Loader2 className="animate-spin text-purple-400 mb-4" size={32} />
        <p className="text-sm font-semibold text-white mb-1">Analyzing Document Structure...</p>
        <p className="text-xs text-slate-400">Generating title, key takeaways, concept definitions, and study guide.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-3xl p-10 text-center animate-in border border-red-500/20">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Generation Failed</h3>
        <p className="text-xs text-red-300 mb-6 max-w-sm mx-auto">{error}</p>
        <button
          onClick={onGenerate}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <RotateCw size={14} />
          <span>Try Again</span>
        </button>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="glass rounded-3xl p-10 text-center animate-in">
        <BookOpen className="mx-auto mb-3 text-purple-400/60" size={36} />
        <h3 className="text-lg font-bold text-white mb-1">No Summary Generated Yet</h3>
        <p className="text-xs text-slate-400 mb-6">Click below to generate a comprehensive AI summary of your notes.</p>
        <button
          onClick={onGenerate}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Sparkles size={14} />
          <span>Generate Summary Now</span>
        </button>
      </div>
    )
  }

  const toggleCheck = (idx) => {
    setCheckedKeys(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="glass rounded-3xl p-7 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>AI Executive Summary</span>
          </span>
          <div className="flex items-center gap-2">
            {summary.difficulty && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300">
                {summary.difficulty} Level
              </span>
            )}
            <button
              onClick={onGenerate}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-purple-500/20 border border-white/10 text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1.5"
              title="Regenerate summary with current sources"
            >
              <Sparkles size={12} className="text-purple-400" />
              <span>Regenerate Summary</span>
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{summary.title || 'Document Summary'}</h2>
        <p className="text-sm text-slate-300 italic leading-relaxed">{summary.oneLiner}</p>
      </div>

      {Array.isArray(summary.keyPoints) && summary.keyPoints.length > 0 && (
        <div className="glass rounded-3xl p-7 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <CheckSquare className="text-emerald-400" size={18} />
            <span>Key Takeaways & Core Findings</span>
          </h3>
          <div className="space-y-2.5">
            {summary.keyPoints.map((point, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  checkedKeys[idx]
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-200 hover:border-white/15'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checkedKeys[idx]}
                  onChange={() => {}}
                  className="mt-0.5 accent-emerald-500 rounded"
                />
                <span className="text-xs leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(summary.mainConcepts) && summary.mainConcepts.length > 0 && (
        <div className="glass rounded-3xl p-7 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Award className="text-amber-400" size={18} />
            <span>Main Concepts & Definitions</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.mainConcepts.map((concept, idx) => {
              const parts = concept.split(':')
              const term = parts[0]
              const def = parts.slice(1).join(':')
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs font-bold text-purple-300 mb-1">{term}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{def || concept}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {summary.studyGuide && (
        <div className="glass rounded-3xl p-7 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="text-blue-400" size={18} />
            <span>Structured Study Guide</span>
          </h3>
          <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
            {summary.studyGuide}
          </div>
        </div>
      )}
    </div>
  )
}
