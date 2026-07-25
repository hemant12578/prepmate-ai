import React from 'react'

export default function QuestionCounter({ value, onChange, options = [5, 8, 10, 15, 20], activeColor = 'purple' }) {
  const colorStyles = {
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    red: 'bg-red-500/20 border-red-500/40 text-red-300',
    blue: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Number of Questions
      </label>
      <div className="flex items-center gap-2">
        {options.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
              value === num
                ? colorStyles[activeColor] || colorStyles.purple
                : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
            }`}
          >
            {num} Qs
          </button>
        ))}
      </div>
    </div>
  )
}
