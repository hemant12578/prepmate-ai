import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import { useApp } from './context/AppContext'
import Login from './components/Login'
import Home from './components/Home'
import StudySetup from './pages/StudySetup'
import StudySession from './pages/StudySession'
import StudySummary from './pages/StudySummary'
import InterviewSetup from './pages/InterviewSetup'
import InterviewSession from './pages/InterviewSession'
import InterviewSummary from './pages/InterviewSummary'
import HistoryDashboard from './components/HistoryDashboard'
import OnboardingModal from './components/OnboardingModal'
import SmartNotes from './pages/SmartNotes'
import About from './pages/About'
import Production from './pages/Production'
import Pricing from './pages/Pricing'
import CustomCursor from './components/CustomCursor'
import PageErrorBoundary from './components/PageErrorBoundary'
import { LogOut, History, User, FileText, Info, Activity, Menu, X, BookOpen, Briefcase, Sparkles, Tag } from 'lucide-react'

// Page transition variants — clean fade & slide
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { screen, setScreen, error, setError, userProfile } = useApp()
  const [toasts, setToasts] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Trigger onboarding if missing userProfile & sync /dashboard route
  useEffect(() => {
    if (user && !userProfile) {
      setShowOnboarding(true)
    }
    if (user && screen === 'home' && window.location.pathname === '/') {
      window.history.replaceState(null, '', '/dashboard')
    }
  }, [user, userProfile, screen])

  useEffect(() => {
    if (error) {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg: error }])
      setError(null)
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
    }
  }, [error])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="dot-pulse"><span /><span /><span /></div>
      </div>
    )
  }

  if (!user) {
    if (screen === 'about') {
      return (
        <main className="relative z-10 pt-10 pb-10 px-4 max-w-4xl mx-auto min-h-screen">
          <PageErrorBoundary>
            <About />
          </PageErrorBoundary>
        </main>
      )
    }
    if (screen === 'production') {
      return (
        <main className="relative z-10 pt-10 pb-10 px-4 max-w-4xl mx-auto min-h-screen">
          <PageErrorBoundary>
            <Production />
          </PageErrorBoundary>
        </main>
      )
    }
    if (screen === 'pricing') {
      return (
        <main className="relative z-10 pt-10 pb-10 px-4 max-w-5xl mx-auto min-h-screen">
          <PageErrorBoundary>
            <Pricing />
          </PageErrorBoundary>
        </main>
      )
    }
    return <Login />
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <Home />

      // Study Mode Flow
      case 'study-setup': return <StudySetup />
      case 'study-session': return <StudySession />
      case 'study-summary': return <StudySummary />

      // Interview Mode Flow
      case 'interview-setup': return <InterviewSetup />
      case 'interview-session': return <InterviewSession />
      case 'interview-summary': return <InterviewSummary />

      // Features & Pages
      case 'history': return <HistoryDashboard />
      case 'smart-notes': return <SmartNotes />
      case 'about': return <About />
      case 'production': return <Production />
      case 'pricing': return <Pricing />
      default: return <Home />
    }
  }

  return (
    <>
      {/* Custom AI Pointer Cursor */}
      <CustomCursor />

      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />
      </div>

      {/* Onboarding Modal for First-time users */}
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <img src="/logo.png" alt="" className="w-7 h-7 rounded" />
            <span className="font-semibold text-sm text-slate-200 tracking-tight">PrepMate AI</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setScreen('home')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                screen === 'home' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Dashboard"
            >
              <Sparkles size={16} className="text-purple-400" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setScreen('smart-notes')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                screen === 'smart-notes' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Smart Notes"
            >
              <FileText size={16} />
              <span className="hidden md:inline">Smart Notes</span>
            </button>

            <button
              onClick={() => setScreen('history')}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                screen === 'history' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Profile & Session History"
            >
              <User size={16} />
              <span className="hidden md:inline">Profile</span>
            </button>

            <button
              onClick={() => setScreen('about')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors hidden md:flex items-center gap-1.5 ${
                screen === 'about' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="About PrepMate AI"
            >
              <Info size={16} />
              <span>About</span>
            </button>

            <button
              onClick={() => setScreen('pricing')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors hidden md:flex items-center gap-1.5 ${
                screen === 'pricing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Pricing & Plans"
            >
              <Tag size={16} />
              <span>Pricing</span>
            </button>

            <button
              onClick={() => setScreen('production')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors hidden md:flex items-center gap-1.5 ${
                screen === 'production' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title="Production & System Status"
            >
              <Activity size={16} />
              <span>Status</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden md:block" />

            <div
              onClick={() => setScreen('history')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              title="View Profile & Settings"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <span className="text-sm text-slate-400 hidden lg:block">{user.displayName?.split(' ')[0]}</span>
            </div>

            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors hidden sm:block"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#0b1226]/95 backdrop-blur-xl px-6 py-4 space-y-3 animate-in">
            <button onClick={() => { setScreen('home'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" /><span>Dashboard</span>
            </button>
            <button onClick={() => { setScreen('study-setup'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-400" /><span>Study Mode Setup</span>
            </button>
            <button onClick={() => { setScreen('interview-setup'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-red-300 flex items-center gap-2">
              <Briefcase size={16} className="text-red-400" /><span>Interview Mode Setup</span>
            </button>
            <button onClick={() => { setScreen('smart-notes'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-300 flex items-center gap-2">
              <FileText size={16} className="text-emerald-400" /><span>Smart Notes</span>
            </button>
            <button onClick={() => { setScreen('history'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2">
              <User size={16} className="text-purple-400" /><span>Profile & History</span>
            </button>
            <button onClick={() => { setScreen('about'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2">
              <Info size={16} className="text-purple-400" /><span>About PrepMate AI</span>
            </button>
            <button onClick={() => { setScreen('pricing'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-amber-300 flex items-center gap-2">
              <Tag size={16} className="text-amber-400" /><span>Pricing & Plans</span>
            </button>
            <button onClick={() => { setScreen('production'); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-slate-200 hover:text-emerald-300 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" /><span>Production & Status</span>
            </button>
            <button onClick={() => { signOut(); setMobileMenuOpen(false) }}
              className="w-full text-left py-2 text-xs font-semibold text-red-400 flex items-center gap-2 border-t border-white/5 pt-3">
              <LogOut size={16} /><span>Sign Out</span>
            </button>
          </div>
        )}
      </motion.header>

      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="toast-enter glass border border-red-500/20 px-4 py-3 rounded-xl max-w-sm">
            <p className="text-sm text-red-400">{t.msg}</p>
          </div>
        ))}
      </div>

      <main className="relative z-10 pt-20 pb-10 px-4 max-w-6xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <PageErrorBoundary>
              {renderScreen()}
            </PageErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-8 px-6 text-center text-xs text-slate-400 bg-black/40 backdrop-blur-md mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('home')}>
            <img src="/logo.png" alt="PrepMate AI" className="w-5 h-5 rounded" />
            <span className="font-bold text-slate-200">PrepMate AI</span>
          </div>
          <p className="text-purple-300 font-semibold flex items-center gap-1.5 flex-wrap justify-center">
            <span>⚡ Built for</span>
            <span className="bg-purple-500/20 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-500/30">InnovaHack Chapter 1</span>
            <span>| Team Nexus</span>
          </p>
          <div className="flex gap-4 text-slate-400">
            <button onClick={() => setScreen('pricing')} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => setScreen('about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => setScreen('production')} className="hover:text-white transition-colors">Status</button>
            <button onClick={() => setScreen('smart-notes')} className="hover:text-white transition-colors">Smart Notes</button>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
