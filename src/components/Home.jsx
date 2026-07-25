import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import TiltCard from './3d/TiltCard'
import {
  BookOpen, Briefcase, ArrowRight, Sparkles, FileText, Flame, Target,
  Award, TrendingUp, Search, Zap, Clock, ShieldAlert, GraduationCap,
  School, CheckCircle2, History, ChevronRight, Play, RefreshCcw, Image as ImageIcon
} from 'lucide-react'

// Helper to calculate real active streak days from history timestamps safely
function calculateRealStreak(history) {
  if (!Array.isArray(history) || history.length === 0) return 0

  const dates = history
    .filter(h => h && h.date)
    .map(h => {
      try {
        return new Date(h.date).toDateString()
      } catch {
        return null
      }
    })
    .filter(Boolean)

  const uniqueDates = Array.from(new Set(dates))
  if (uniqueDates.length === 0) return 0

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date()
    checkDate.setDate(today.getDate() - i)
    if (uniqueDates.includes(checkDate.toDateString())) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const cardFade = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Home() {
  const { setMode, setScreen, userProfile, history, startStudySession, startInterviewSession } = useApp()
  const { user } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')

  const firstName = user?.displayName?.split(' ')[0] || 'there'

  // REAL COMPUTED DATA (ZERO FAKE DEMO DATA)
  const safeHistory = Array.isArray(history) ? history.filter(Boolean) : []
  const totalSessions = safeHistory.length
  const realStreak = calculateRealStreak(safeHistory)

  const avgScorePct = totalSessions > 0
    ? Math.round(
        safeHistory.reduce((sum, h) => {
          let scoreNum = 0
          if (typeof h.averageScore === 'number') {
            scoreNum = h.averageScore > 10 ? h.averageScore : h.averageScore * 10
          } else if (h.score) {
            const str = String(h.score).replace('%', '')
            if (str.includes('/')) {
              const [num, den] = str.split('/').map(Number)
              scoreNum = den ? (num / den) * 100 : num * 10
            } else {
              scoreNum = parseFloat(str) || 0
            }
          }
          return sum + (isNaN(scoreNum) ? 0 : scoreNum)
        }, 0) / totalSessions
      )
    : 0

  // Real User Goal from onboarding profile
  const userBoard = userProfile?.board || 'CBSE'
  const userGrade = userProfile?.grade || 'Class 10'
  const userSubject = userProfile?.subject || 'Science'
  const userGoalLabel = userProfile?.targetGoal || `${userBoard} ${userGrade} Excellence`

  // Dynamic quick launch items matching real user grade/board
  const quickSearchSuggestions = [
    { label: `${userGrade} ${userSubject}`, type: 'study', subject: userSubject, topic: `${userSubject} Core Concepts` },
    { label: `${userGrade} Mathematics`, type: 'study', subject: 'Mathematics', topic: 'Algebra & Equations' },
    { label: `${userGrade} Science Viva`, type: 'interview', category: 'school', subject: userSubject },
    { label: 'Technical HR Interview', type: 'interview', category: 'job', role: 'Software Developer' },
  ]

  const handleQuickLaunch = (item) => {
    if (item.type === 'study') {
      startStudySession({
        board: userBoard,
        grade: userGrade,
        subject: item.subject,
        topic: item.topic,
        format: 'mixed',
        difficulty: 'Medium',
        questionCount: 10,
        pyqMode: true
      })
    } else {
      startInterviewSession({
        category: item.category || 'job',
        school: { board: userBoard, grade: userGrade, subject: item.subject || userSubject, topic: 'General', vivaStyle: 'Oral Viva' },
        college: { targetType: 'IIT/NIT', round: 'Personal Interview', focusArea: 'Academic Background' },
        job: { expLevel: 'Fresher (0-1 yr)', role: item.role || 'Software Developer', round: 'HR', companyType: 'Product Company' },
        pressureMode: 'Normal',
        questionCount: 8
      })
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    startStudySession({
      board: userBoard,
      grade: userGrade,
      subject: 'General',
      topic: searchQuery.trim(),
      format: 'mixed',
      difficulty: 'Medium',
      questionCount: 10,
      pyqMode: false
    })
  }

  const modeCards = [
    {
      key: 'study',
      color: 'purple',
      borderColor: 'border-purple-500/20 hover:border-purple-500/50',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]',
      bg: 'from-[#0e162e] to-[#0c1022]',
      icon: BookOpen,
      iconColor: 'text-purple-400',
      title: 'Study Mode',
      description: 'Master academic chapters with adaptive AI questions, CBSE/ICSE board patterns, 1-10 rubric scoring, concept explanations, and memory tricks.',
      badge: `${userBoard} ${userGrade}`,
      badgeBg: 'bg-purple-900/80 text-purple-200 border-purple-400/30',
      image: '/assets/study_mode.jpg',
      checkColor: 'text-purple-400',
      checks: ['CBSE, ICSE, Bihar & State Board PYQ', 'MCQ, True/False & Short Answer Formats', 'Concept Teacher Explanations & Mnemonics'],
      cta: 'Configure Study Session',
      ctaColor: 'text-purple-400',
      onClick: () => { setMode('study'); setScreen('study-setup') },
    },
    {
      key: 'interview',
      color: 'red',
      borderColor: 'border-red-500/20 hover:border-red-500/50',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      bg: 'from-[#180d1e] to-[#0c0a18]',
      icon: Briefcase,
      iconColor: 'text-red-400',
      title: 'Interview Mode',
      description: 'Simulate real corporate HR/Technical interviews, School Vivas, and College Entrance rounds with STAR format checks and hiring manager debriefs.',
      badge: '90s Pressure Mode',
      badgeBg: 'bg-red-900/80 text-red-200 border-red-400/30',
      badgeIcon: ShieldAlert,
      image: '/assets/interview_mode.jpg',
      checkColor: 'text-red-400',
      checks: ['School Viva, College PI & Job Roles', '90s Countdown Timer with Auto-Submit', 'Content, Communication & Structure Rubrics'],
      cta: 'Configure Interview Session',
      ctaColor: 'text-red-400',
      onClick: () => { setMode('interview'); setScreen('interview-setup') },
    },
    {
      key: 'smart-notes',
      color: 'emerald',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/50',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      bg: 'from-[#0d1f1c] to-[#071312]',
      icon: FileText,
      iconColor: 'text-emerald-400',
      title: 'Smart Notes',
      description: 'Upload PDFs, paste text notes, photos of textbook pages (OCR), or YouTube links to generate multi-source summaries, 3D flashcards, chat, and audio podcasts.',
      badge: 'NotebookLM Hub',
      badgeBg: 'bg-emerald-900/80 text-emerald-200 border-emerald-400/30',
      image: '/assets/smart_notes.jpg',
      checkColor: 'text-emerald-400',
      sources: [
        { icon: FileText, color: 'text-red-400', label: 'PDF Textbooks' },
        { icon: Play, color: 'text-red-400', label: 'YouTube Lectures' },
        { icon: ImageIcon, color: 'text-blue-400', label: 'Photo OCR' },
        { icon: Zap, color: 'text-purple-400', label: 'Audio Podcasts' },
      ],
      cta: 'Open Sources Hub',
      ctaColor: 'text-emerald-400',
      onClick: () => setScreen('smart-notes'),
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* MODERN SLEEK HERO & DASHBOARD HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-r from-[#0d152e] via-[#0f172a] to-[#160b2e]"
      >
        {/* Soft Ambient Radial Blur */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-semibold">
              <Sparkles size={14} className="text-purple-400" />
              <span>AI Learning Platform</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient">{firstName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Target Goal: <span className="text-purple-300 font-semibold">{userGoalLabel}</span>
            </p>
          </div>

          {/* REAL COMPUTED STAT COUNTERS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Flame size={14} />
                <span className="text-[10px] sm:text-xs font-bold uppercase">Streak</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-white">{realStreak} {realStreak === 1 ? 'Day' : 'Days'}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <Award size={14} />
                <span className="text-[10px] sm:text-xs font-bold uppercase">Avg Score</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-white">
                {totalSessions > 0 ? `${avgScorePct}%` : 'N/A'}
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                <CheckCircle2 size={14} />
                <span className="text-[10px] sm:text-xs font-bold uppercase">Sessions</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-white">{totalSessions}</p>
            </div>
          </div>
        </div>

        {/* Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 relative z-10">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What topic do you want to master today? (e.g. Chemical Reactions, System Design)..."
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3.5 rounded-2xl btn-primary text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md shrink-0"
            >
              <span>Instant AI Quiz</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Quick Launch Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-[11px] text-slate-400 font-semibold">Quick Launch Shortcuts:</span>
          {quickSearchSuggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickLaunch(item)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.06] hover:border-purple-500/30 text-[11px] text-slate-300 hover:text-purple-300 transition-all flex items-center gap-1"
            >
              <Zap size={11} className="text-amber-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3 MAIN FEATURE MODE CARDS WITH 3D TILT */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={cardStagger}
        initial="hidden"
        animate="visible"
      >
        {modeCards.map((card, index) => {
          const Icon = card.icon
          const BadgeIcon = card.badgeIcon

          return (
            <motion.div key={card.key} variants={cardFade}>
              <TiltCard
                onClick={card.onClick}
                className={`glass rounded-3xl ${card.borderColor} shadow-2xl group ${card.hoverShadow} hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden bg-gradient-to-b ${card.bg}`}
                options={{ max: 10, speed: 400, glare: true, 'max-glare': 0.2, scale: 1.02 }}
              >
                {/* Banner Image */}
                <div className="h-40 relative overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.bg.split(' ')[0].replace('from-', 'from-')} via-transparent to-transparent`} />

                  {/* Glowing dot in corner */}
                  <div className={`absolute top-3 left-3 w-2 h-2 rounded-full bg-${card.color}-400 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity`} />

                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${card.badgeBg}`}>
                    {BadgeIcon && <BadgeIcon size={12} />}
                    {card.badge}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={20} className={card.iconColor} />
                      <h2 className={`text-xl font-bold text-white group-hover:text-${card.color}-300 transition-colors`}>
                        {card.title}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Feature checks or source badges */}
                  {card.checks ? (
                    <div className="space-y-1.5">
                      {card.checks.map((check, ci) => (
                        <div key={ci} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 size={14} className={`${card.checkColor} shrink-0`} />
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  ) : card.sources ? (
                    <div className="grid grid-cols-2 gap-2">
                      {card.sources.map((s, si) => {
                        const SIcon = s.icon
                        return (
                          <div key={si} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-300 flex items-center gap-1.5">
                            <SIcon size={12} className={s.color} />
                            <span>{s.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}

                  <div className={`pt-4 border-t border-white/5 flex items-center justify-between ${card.ctaColor} text-xs font-bold group-hover:translate-x-1 transition-transform mt-auto`}>
                    <span>{card.cta}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>

      {/* RECENT SESSION HISTORY FEED */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-purple-400" />
            <h3 className="text-base font-bold text-white">Recent Session Activity</h3>
          </div>
          <button
            onClick={() => setScreen('history')}
            className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View Profile & History</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {safeHistory.length > 0 ? (
          <div className="space-y-2.5">
            {safeHistory.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    item?.mode === 'study' ? 'bg-purple-500/20 text-purple-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {item?.mode === 'study' ? <BookOpen size={16} /> : <Briefcase size={16} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item?.topic || 'Session'}</h4>
                    <p className="text-[11px] text-slate-400">{item?.date || 'Recent'} • {item?.questionsCount || 5} Questions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {item?.score || (item?.averageScore ? `${item.averageScore}/10` : 'Passed')}
                  </span>
                  <button
                    onClick={() => {
                      if (item?.mode === 'study') setScreen('study-setup')
                      else setScreen('interview-setup')
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <RefreshCcw size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2">
            <p className="text-xs text-slate-400">No previous sessions completed yet.</p>
            <p className="text-xs text-purple-300 font-semibold">Select Study Mode or Interview Mode above to start your first session!</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
