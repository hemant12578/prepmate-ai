import { useApp } from '../context/AppContext'
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, BarChart3 } from 'lucide-react'

function ScoreRing({ score, size = 100, stroke = 6 }) {
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

export default function FeedbackCard() {
  const {
    currentFeedback, currentQ, setCurrentQ,
    setCurrentQuestion, setCurrentFeedback, setScreen
  } = useApp()

  if (!currentFeedback) return null

  const { score, whatYouGotRight, whatYouMissed, idealAnswer, encouragement } = currentFeedback
  const isLast = currentQ >= 4

  const handleNext = () => {
    setCurrentFeedback(null)
    setCurrentQuestion(null)
    if (isLast) {
      setScreen('summary')
    } else {
      setCurrentQ(prev => prev + 1)
      setScreen('question')
    }
  }

  return (
    <div className="animate-in">
      <div className="glass rounded-2xl p-7">
        <div className="flex flex-col items-center mb-7 animate-in delay-1">
          <ScoreRing score={score} />
          <p className="text-slate-400 text-sm mt-3">{encouragement}</p>
        </div>

        <div className="mb-3 p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 animate-in delay-2">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <h3 className="text-sm font-medium text-emerald-400">What you got right</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{whatYouGotRight}</p>
        </div>

        <div className="mb-3 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 animate-in delay-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} className="text-amber-400" />
            <h3 className="text-sm font-medium text-amber-400">What to improve</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{whatYouMissed}</p>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/10 animate-in delay-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={15} className="text-purple-400" />
            <h3 className="text-sm font-medium text-purple-400">Ideal answer</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{idealAnswer}</p>
        </div>

        <button
          onClick={handleNext}
          className="w-full btn-primary py-3 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 animate-in delay-5"
        >
          {isLast ? (
            <>
              <BarChart3 size={16} />
              <span>View Summary</span>
            </>
          ) : (
            <>
              <span>Next Question ({currentQ + 2}/5)</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
