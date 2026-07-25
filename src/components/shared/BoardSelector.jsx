import React from 'react'

export const BOARDS = [
  { id: 'CBSE', name: 'CBSE Board' },
  { id: 'ICSE', name: 'ICSE / ISC Board' },
  { id: 'Bihar', name: 'Bihar Board (BSEB)' },
  { id: 'UP', name: 'UP Board (UPMSP)' },
  { id: 'Maharashtra', name: 'Maharashtra Board' },
  { id: 'IB', name: 'IB / IGCSE International' },
]

export const CLASSES = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College / Univ'
]

export default function BoardSelector({ selectedBoard, onSelectBoard, selectedClass, onSelectClass }) {
  return (
    <div className="space-y-4">
      {/* Board Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Education Board
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BOARDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBoard(b.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left truncate ${
                selectedBoard === b.id
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-sm'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Class Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Grade / Class
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {CLASSES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onSelectClass(c)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                selectedClass === c
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-sm'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
