import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import {
  Trophy, BookOpen, Clock, ChevronLeft, RotateCcw, Target, Sparkles, User, Award, Flame
} from 'lucide-react'

export default function HistoryDashboard() {
  const { userProfile, history, setScreen, setTopic, setMode, setDifficulty } = useApp()
  const { user } = useAuth()

  const totalSessions = history.length
  const totalQuestions = totalSessions * 5
  const avgScore = totalSessions > 0
    ? (history.reduce((sum, h) => sum + (h.averageScore || 0), 0) / totalSessions).toFixed(1)
    : '0.0'

  const handleRetake = (h) => {
    setMode(h.mode || 'study')
    setTopic(h.topic)
    setDifficulty(h.difficulty || 'Medium')
    setScreen('question')
  }

  return (
    <div className="animate-in max-w-4xl mx-auto py-6">
      <button
        onClick={() => setScreen('home')}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      {/* User Profile Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-20 h-20 rounded-2xl border-2 border-purple-500/40 shadow-xl" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center text-purple-300 text-2xl font-bold">
              {user?.displayName?.[0] || 'U'}
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-light text-xs text-purple-300 mb-2 border border-purple-500/20">
              <User size={12} />
              <span>Student Profile & Learning History</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.displayName || 'Student'}</h2>
            <p className="text-xs text-slate-400 mb-3">{user?.email}</p>

            {userProfile && (
              <div className="flex flex-wrap gap-2 text-xs">
                {userProfile.focus && (
                  <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    {userProfile.focus}
                  </span>
                )}
                {userProfile.board && (
                  <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    {userProfile.board} • {userProfile.grade}
                  </span>
                )}
                {userProfile.targetGoal && (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    Goal: {userProfile.targetGoal}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5 text-center">
          <div>
            <p className="text-2xl font-extrabold text-white">{totalSessions}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Completed Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-purple-400">{avgScore}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Average Score</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-400">{totalQuestions}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Questions Answered</p>
          </div>
        </div>
      </div>

      {/* History Log List */}
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Clock size={18} className="text-purple-400" />
        <span>Recent Session History</span>
      </h3>

      {history.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-slate-400 text-sm">
          <BookOpen size={32} className="mx-auto mb-3 text-slate-600" />
          <p>No practice sessions completed yet.</p>
          <button
            onClick={() => setScreen('home')}
            className="btn-primary px-5 py-2.5 rounded-xl text-white text-xs font-semibold mt-4"
          >
            Start First Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="glass rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                    h.mode === 'study' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                  }`}>
                    {h.mode ? h.mode.toUpperCase() : 'STUDY'}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-semibold text-white">{h.topic}</h4>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-400">{h.averageScore || '0'}/10</p>
                  <p className="text-[10px] text-slate-500">{h.performanceBadge || 'Completed'}</p>
                </div>

                <button
                  onClick={() => handleRetake(h)}
                  className="px-3 py-1.5 rounded-xl glass-light border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
