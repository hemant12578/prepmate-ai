import { useState } from 'react'
import { generateAudioScript } from '../../services/smartnotes'
import { useAudioOverview } from '../../hooks/useAudioOverview'
import { Play, Pause, Square, Volume2, Sparkles, Loader2, AlertTriangle, RotateCw } from 'lucide-react'

export default function AudioOverview({ docText }) {
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isSupported, isPlaying, voices, selectedVoice, setSelectedVoice, rate, setRate, progress, speak, pause, resume, stop } = useAudioOverview()

  const handleGenerate = async () => {
    if (!docText) return
    setLoading(true)
    setError(null)
    try {
      const res = await generateAudioScript(docText)
      setScript(res)
    } catch (err) {
      setError(err.message || 'Failed to generate audio overview.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-xs text-amber-400 border border-amber-500/20">
        Audio Speech Synthesis is not supported in this browser.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center animate-in">
        <Loader2 className="animate-spin text-purple-400 mb-4" size={32} />
        <p className="text-sm font-semibold text-white mb-1">Writing Educational Audio Overview...</p>
        <p className="text-xs text-slate-400">Creating a 2-3 minute podcast-style spoken overview script.</p>
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
          onClick={handleGenerate}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <RotateCw size={14} />
          <span>Try Again</span>
        </button>
      </div>
    )
  }

  if (!script) {
    return (
      <div className="glass rounded-3xl p-10 text-center animate-in">
        <Volume2 className="mx-auto mb-3 text-purple-400/60" size={36} />
        <h3 className="text-lg font-bold text-white mb-1">No Audio Overview Generated</h3>
        <p className="text-xs text-slate-400 mb-6">Generate an engaging AI audio podcast summary of your notes.</p>
        <button
          onClick={handleGenerate}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Sparkles size={14} />
          <span>Generate Audio Overview</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in max-w-2xl mx-auto">
      {/* Custom Audio Player Container */}
      <div className="glass rounded-3xl p-7 border border-purple-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="text-purple-400" size={20} />
            <h3 className="text-base font-bold text-white">Audio Overview Player</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-purple-500/20 border border-white/10 text-purple-300 flex items-center gap-1.5 transition-all"
              title="Regenerate audio podcast script from sources"
            >
              <Sparkles size={12} className="text-purple-400" />
              <span>Regenerate Script</span>
            </button>

            {/* Equalizer Waveform Animation */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-5">
                <div className="w-1 bg-purple-400 rounded-full animate-bounce h-full" />
                <div className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0.15s' }} />
                <div className="w-1 bg-blue-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Player Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <button
                onClick={() => speak(script)}
                className="w-12 h-12 rounded-full btn-primary flex items-center justify-center text-white shadow-lg shadow-purple-500/30"
              >
                <Play size={20} className="ml-0.5" />
              </button>
            ) : (
              <button
                onClick={pause}
                className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30"
              >
                <Pause size={20} />
              </button>
            )}

            <button
              onClick={stop}
              className="p-3 rounded-2xl glass border border-white/10 text-slate-400 hover:text-white"
            >
              <Square size={16} />
            </button>
          </div>

          {/* Voice & Speed Controls */}
          <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(Number(e.target.value))}
              className="bg-white/[0.03] border border-white/[0.06] text-white text-xs rounded-xl px-3 py-2"
            >
              {voices.slice(0, 5).map((v, i) => (
                <option key={i} value={i} className="bg-slate-900 text-white">{v.name} ({v.lang})</option>
              ))}
            </select>

            <select
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-white/[0.03] border border-white/[0.06] text-white text-xs rounded-xl px-3 py-2"
            >
              <option value={0.75} className="bg-slate-900 text-white">0.75x</option>
              <option value={1.0} className="bg-slate-900 text-white">1.0x</option>
              <option value={1.25} className="bg-slate-900 text-white">1.25x</option>
              <option value={1.5} className="bg-slate-900 text-white">1.5x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Script Card */}
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Spoken Audio Script</h4>
        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto pr-2">
          {script}
        </div>
      </div>
    </div>
  )
}
