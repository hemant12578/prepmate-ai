import { useEffect, useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { generateSummary } from '../services/openrouter'
import Loader from './Loader'
import { Trophy, Award, TrendingUp, Target, BookMarked, RotateCcw, Home as HomeIcon } from 'lucide-react'

function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.round(start * 10) / 10)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span>{count}</span>
}

export default function Summary() {
  const { topic, mode, difficulty, questions, scores, resetSession, tryAgain, addSessionToHistory } = useApp()
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSummary() }, [])

  async function fetchSummary() {
    try {
      const qAndScores = questions.map((q) => ({
        question: q.question, score: q.score, difficulty: q.difficulty
      }))
      const result = await generateSummary(topic, mode, qAndScores)
      setSummary(result)
      addSessionToHistory({
        topic,
        mode,
        difficulty,
        totalScore: result.totalScore,
        averageScore: result.averageScore,
        performanceBadge: result.performanceBadge,
        date: new Date().toISOString()
      })
    } catch (err) {
      console.warn('summary gen failed:', err)
      const avg = scores.reduce((s, x) => s + x.score, 0) / scores.length
      const passed = scores.filter(x => x.score >= 5).length
      const fallbackSummary = {
        totalScore: `${passed}/${scores.length}`,
        averageScore: Math.round(avg * 10) / 10,
        performanceBadge: avg >= 8 ? 'Excellent' : avg >= 5 ? 'Good' : 'Keep Practicing',
        strengths: ['Completed the full session'],
        gaps: ['Review areas where you scored below 5'],
        suggestedResources: [`Continue practicing ${topic}`],
        motivationalMessage: `Great effort${user?.displayName ? ', ' + user.displayName.split(' ')[0] : ''}! Keep learning.`
      }
      setSummary(fallbackSummary)
      addSessionToHistory({
        topic,
        mode,
        difficulty,
        totalScore: fallbackSummary.totalScore,
        averageScore: fallbackSummary.averageScore,
        performanceBadge: fallbackSummary.performanceBadge,
        date: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader text="Analyzing your performance" />
  if (!summary) return null

  const badgeConfig = {
    Excellent: { icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    Good: { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    'Keep Practicing': { icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  }
  const badge = badgeConfig[summary.performanceBadge] || badgeConfig.Good
  const BadgeIcon = badge.icon

  return (
    <div className="animate-in">
      <div className="glass rounded-2xl p-7">
        <div className="text-center mb-8 animate-in delay-1">
          <h2 className="text-xl font-semibold text-white mb-1">Session Complete</h2>
          <p className="text-sm text-slate-400 capitalize">{mode} — {topic}</p>
        </div>

        <div className="flex justify-center gap-10 mb-8 animate-in delay-2">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{summary.totalScore}</p>
            <p className="text-xs text-slate-500 mt-1">Passed</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              <AnimatedCounter target={summary.averageScore} />
            </p>
            <p className="text-xs text-slate-500 mt-1">Avg Score</p>
          </div>
        </div>

        <div className="flex justify-center mb-7 animate-in delay-2">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium ${badge.bg} ${badge.color}`}>
            <BadgeIcon size={16} />
            <span>{summary.performanceBadge}</span>
          </div>
        </div>

        <div className="space-y-3 mb-7">
          <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 animate-in delay-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-emerald-400" />
              <h3 className="text-sm font-medium text-emerald-400">Strengths</h3>
            </div>
            <ul className="space-y-1">
              {summary.strengths.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-500/50 mt-1">—</span>{s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 animate-in delay-3">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-amber-400" />
              <h3 className="text-sm font-medium text-amber-400">Areas to Improve</h3>
            </div>
            <ul className="space-y-1">
              {summary.gaps.map((g, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-amber-500/50 mt-1">—</span>{g}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/10 animate-in delay-4">
            <div className="flex items-center gap-2 mb-2">
              <BookMarked size={14} className="text-purple-400" />
              <h3 className="text-sm font-medium text-purple-400">Suggested Resources</h3>
            </div>
            <ul className="space-y-1">
              {summary.suggestedResources.map((r, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-purple-500/50 mt-1">—</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] text-center mb-6 animate-in delay-4">
          <p className="text-sm text-slate-300 italic">{summary.motivationalMessage}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 animate-in delay-5">
          <button
            onClick={tryAgain}
            className="py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <button
            onClick={resetSession}
            className="btn-primary py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
          >
            <HomeIcon size={14} />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  )
}
