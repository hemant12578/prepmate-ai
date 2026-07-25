import { useState, useEffect } from 'react'
import { Timer, AlertCircle } from 'lucide-react'

export default function PressureTimer({ initialSeconds = 90, onTimeUp, active = true }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)

  useEffect(() => {
    if (!active) return
    setTimeLeft(initialSeconds)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (onTimeUp) onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [initialSeconds, active])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const isWarning = timeLeft <= 30
  const pct = (timeLeft / initialSeconds) * 100

  return (
    <div className={`p-3 rounded-2xl border transition-all mb-4 ${
      isWarning ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-white/[0.03] border-white/[0.06] text-slate-300'
    }`}>
      <div className="flex items-center justify-between text-xs font-bold mb-2">
        <div className="flex items-center gap-1.5">
          {isWarning ? <AlertCircle size={14} className="text-red-400" /> : <Timer size={14} className="text-amber-400" />}
          <span>{isWarning ? 'PRESSURE MODE TIME WARNING' : 'TIME REMAINING'}</span>
        </div>
        <span className={isWarning ? 'text-red-400 text-sm font-mono' : 'text-slate-200 font-mono'}>
          {formatted}
        </span>
      </div>

      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${isWarning ? 'bg-red-500' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
