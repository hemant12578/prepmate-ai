import { useState, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import TiltCard from './3d/TiltCard'
import AnimatedCounter from './3d/AnimatedCounter'
import CustomCursor from './CustomCursor'
import ThreeErrorBoundary from './3d/ThreeErrorBoundary'
import {
  Sparkles, BookOpen, Briefcase, Mic, Award, Zap, ChevronDown, ChevronUp,
  CheckCircle2, ArrowRight, ShieldCheck, Target, BarChart3, Loader2, Star,
  Cpu, FileText, Activity, Info, Server, Menu, X, Play, Image as ImageIcon, Tag
} from 'lucide-react'

// Lazy-load heavy 3D canvases — only on desktop
const ParticleGrid = lazy(() => import('./3d/ParticleGrid'))
const HeroOrb = lazy(() => import('./3d/HeroOrb'))

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Stagger animation variants
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function LandingPage() {
  const { signInWithGoogle, user } = useAuth()
  const { setScreen } = useApp()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignIn = async () => {
    if (user) {
      setScreen('home')
      return
    }
    setLoading(true)
    setErr(null)
    try {
      await signInWithGoogle()
      setScreen('home')
    } catch (e) {
      console.warn('sign in failed:', e)
      setErr('Could not sign in with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNavClick = (target) => {
    setMobileMenuOpen(false)
    if (target === 'smart-notes') {
      if (user) {
        setScreen(target)
      } else {
        handleSignIn()
      }
    } else {
      setScreen(target)
    }
  }

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  const faqs = [
    {
      q: 'How does PrepMate AI evaluate my answers?',
      a: 'PrepMate AI uses OpenRouter AI models to score your responses on a 1-10 scale, highlighting key concepts you got right, identifying missing details, and providing STAR format interview feedback.'
    },
    {
      q: 'Can I practice using voice input?',
      a: 'Yes! PrepMate AI features built-in Web Speech API voice recognition. Speak your responses naturally, and the app transcribes them for real-time evaluation.'
    },
    {
      q: 'What is NotebookLM Smart Notes?',
      a: 'Smart Notes allows you to upload PDFs, paste text notes, upload textbook photos (OCR), or paste YouTube links to create summaries, 3D flashcards, chat, and audio overview podcasts.'
    },
    {
      q: 'Is PrepMate AI free to use?',
      a: '100% free! Simply sign in with your Google account to access all features, study modes, voice recognition, and performance summaries.'
    }
  ]

  const features = [
    {
      icon: Sparkles,
      title: 'Adaptive AI Engine',
      desc: 'Questions get harder or easier based on your real-time performance score across sessions.',
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      icon: FileText,
      title: 'NotebookLM Sources Hub',
      desc: 'Upload PDFs, paste notes, add YouTube videos — AI analyses all sources combined.',
      color: 'bg-teal-500/20 text-teal-400',
    },
    {
      icon: ShieldCheck,
      title: '90s Pressure Mode',
      desc: 'Simulate real interview pressure with countdown timer and strict evaluation criteria.',
      color: 'bg-red-500/20 text-red-400',
    },
    {
      icon: Mic,
      title: 'Speech Recognition',
      desc: 'Answer questions by voice — AI evaluates spoken responses in real time.',
      color: 'bg-blue-500/20 text-blue-400',
    },
  ]

  const allFeatures = [
    { icon: BookOpen, title: 'Adaptive Study Mode', desc: 'Practice Class 5-12+ board exams with PYQ styles, 4-option MCQs, True/False, concept explanations, and memory tricks.' },
    { icon: Briefcase, title: 'Interview Simulator', desc: 'Simulate School Vivas, College Entrance Interviews, or Job Interviews with 90s Pressure Mode countdown.' },
    { icon: FileText, title: 'NotebookLM Sources Hub', desc: 'Upload PDFs, notes, YouTube video lectures, or textbook photos via Tesseract OCR to learn across all sources.' },
    { icon: Mic, title: 'Voice Speech Recognition', desc: 'Speak your answers out loud with native Web Speech API recognition for true-to-life interview practice.' },
    { icon: Award, title: '3-Bar Rubric Evaluation', desc: 'Detailed breakdown of Content Accuracy, Communication Clarity, Structure, and STAR format check.' },
    { icon: Server, title: 'Enterprise Multi-Model AI', desc: 'Automated OpenRouter failover chain across LLaMA, Gemma, and auto models for 99.99% uptime.' },
  ]

  // Scroll reveal sections
  const [featRef, featInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [testRef, testInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden bg-[#030712]">
      <CustomCursor />

      {/* ——— MESH BACKGROUND ——— */}
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />
      </div>

      {/* ——— FLOATING GLASSMORPHISM NAVBAR ——— */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl nav-floating shadow-lg shadow-black/20 overflow-hidden border border-white/10"
      >
        <div className="px-3 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <img src="/logo.png" alt="PrepMate AI" className="w-7 h-7 rounded-lg shadow-lg shadow-purple-500/20" />
            <span className="font-bold text-sm text-white tracking-tight">PrepMate AI</span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <button onClick={() => handleNavClick('home')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              Study & Interview
            </button>
            <button onClick={() => handleNavClick('smart-notes')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <FileText size={13} className="text-emerald-400" />
              Notes
            </button>
            <button onClick={() => handleNavClick('about')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <Info size={13} className="text-purple-400" />
              About
            </button>
            <button onClick={() => handleNavClick('pricing')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <Tag size={13} className="text-amber-400" />
              Pricing
            </button>
            <button onClick={() => handleNavClick('production')} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <Activity size={13} className="text-emerald-400" />
              Status
            </button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold text-xs hover:bg-gray-100 transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <GoogleIcon />}
              <span className="hidden sm:inline">{user ? 'Enter App' : 'Sign In'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 px-6 py-4 space-y-3">
            <button onClick={() => handleNavClick('home')}
              className="w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2">
              <BookOpen size={16} className="text-purple-400" /><span>Study & Interview</span>
            </button>
            <button onClick={() => handleNavClick('smart-notes')}
              className="w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-emerald-300 flex items-center gap-2">
              <FileText size={16} className="text-emerald-400" /><span>Smart Notes</span>
            </button>
            <button onClick={() => handleNavClick('about')}
              className="w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-2">
              <Info size={16} className="text-purple-400" /><span>About Us</span>
            </button>
            <button onClick={() => handleNavClick('pricing')}
              className="w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-amber-300 flex items-center gap-2">
              <Tag size={16} className="text-amber-400" /><span>Pricing & Plans</span>
            </button>
            <button onClick={() => handleNavClick('production')}
              className="w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-emerald-300 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" /><span>Production & Status</span>
            </button>
          </div>
        )}
      </motion.header>

      {/* ——— 3D HERO SECTION ——— */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* Three.js Particle Grid Background — desktop only */}
        {!isMobile && (
          <ThreeErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <ParticleGrid />
            </Suspense>
          </ThreeErrorBoundary>
        )}

        {/* CSS radial glow behind text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
        />

        {/* 3D floating orb — desktop only */}
        {!isMobile && (
          <ThreeErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <HeroOrb />
            </Suspense>
          </ThreeErrorBoundary>
        )}

        {/* Hero text content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Animated badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs sm:text-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Next-Gen AI Learning & Interview Platform
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          >
            Master Any Topic.
            <br />
            <span className="text-gradient-animated">
              Ace Every Interview.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
          >
            Adaptive study practice, 90s pressure interview simulations,
            NotebookLM multi-source analysis, and voice recognition —
            all in one AI platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
              <span>Get Started Free with Google</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('features')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 border border-purple-500/30 text-white rounded-xl font-semibold text-lg hover:bg-purple-500/10 backdrop-blur-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Play size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Explore Interactive Demo</span>
            </button>
          </motion.div>

          {err && (
            <div className="max-w-md mx-auto mt-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {err}
            </div>
          )}
        </motion.div>
      </section>

      {/* ——— FEATURE SHOWCASE — 3D TILT CARDS ——— */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Built for Peak Performance</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Four pillars that make PrepMate AI the most advanced AI learning platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <TiltCard
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] h-full hover:border-purple-500/30 transition-colors duration-300"
                  options={{ max: 15, speed: 400, glare: true, 'max-glare': 0.3, scale: 1.05 }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3
                    className="text-white font-bold text-lg mb-2"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-gray-400 text-sm leading-relaxed"
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    {f.desc}
                  </p>
                </TiltCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ——— ANIMATED STATS COUNTER ——— */}
      <section id="stats" className="border-y border-white/5 bg-white/[0.01] py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
              <AnimatedCounter end={60} suffix="+" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">PDF Question Banks</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-1">
              <AnimatedCounter end={100} suffix="%" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">Free Access</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-1">
              <AnimatedCounter end={90} suffix="s" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">Pressure Timer</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">
              <AnimatedCounter end={99} suffix="%" prefix="" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">AI Uptime (OpenRouter)</p>
          </div>
        </div>
      </section>

      {/* ——— FULL FEATURE GRID ——— */}
      <section ref={featRef} className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">Designed for Peak Performance</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Everything you need to master technical subjects and ace competitive interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFeatures.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Icon size={20} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ——— 3D FLOATING APP PREVIEW ——— */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          style={{ perspective: '1000px', perspectiveOrigin: 'center center' }}
          className="relative"
        >
          <motion.div
            initial={{ rotateX: 25, opacity: 0, y: 60 }}
            whileInView={{ rotateX: 10, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/20"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10 pointer-events-none" />

            {/* Browser chrome mockup */}
            <div className="bg-[#1a1a2e] px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-gray-500 text-xs">
                prepmate.ai
              </div>
            </div>

            {/* App preview — show study/interview/notes images in a grid */}
            <div className="bg-[#0b1226] p-6 grid grid-cols-3 gap-4">
              <img src="/assets/study_mode.jpg" alt="Study Mode" className="rounded-xl w-full h-36 sm:h-48 object-cover border border-white/5" />
              <img src="/assets/interview_mode.jpg" alt="Interview Mode" className="rounded-xl w-full h-36 sm:h-48 object-cover border border-white/5" />
              <img src="/assets/smart_notes.jpg" alt="Smart Notes" className="rounded-xl w-full h-36 sm:h-48 object-cover border border-white/5" />
            </div>
          </motion.div>

          {/* Floating glow under the mockup */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-3xl bg-purple-600/30 rounded-full" />
        </motion.div>
      </section>

      {/* ——— TESTIMONIALS ——— */}
      <section ref={testRef} className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Loved by Students & Engineers</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Real feedback from job seekers and learners</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: '"The voice input and STAR format feedback helped me refine my answers for technical HR rounds. I landed my Frontend Engineer role!"', name: 'Alex R.', role: 'Software Engineer' },
            { text: '"NotebookLM Smart Notes parsed my PDF textbook and created 3D flashcards instantly. The CBSE PYQ mode is incredible."', name: 'Priya M.', role: 'Class 10 CBSE Student' },
            { text: '"The 90s Pressure Mode timer makes mock interviews feel like real corporate interview rounds. Best free prep coach!"', name: 'David K.', role: 'Data Analyst Candidate' },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <TiltCard
                className="glass rounded-2xl p-6 border border-white/5 h-full"
                options={{ max: 8, speed: 300, glare: true, 'max-glare': 0.15 }}
              >
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{t.text}</p>
                <p className="text-xs font-semibold text-white">{t.name}</p>
                <p className="text-[10px] text-slate-500">{t.role}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— FAQ SECTION ——— */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Everything you need to know about PrepMate AI</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="glass rounded-2xl border border-white/5 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-4 sm:p-5 text-left font-semibold text-xs sm:text-sm text-white flex items-center justify-between gap-4 hover:bg-white/[0.02]"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-purple-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-in">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— BOTTOM CTA BANNER ——— */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 sm:p-14 border border-purple-500/20 glow-md relative overflow-hidden"
        >
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Ready to Elevate Your Skills?</h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-8">
              Join thousands of students and developers using PrepMate AI to practice topics and ace job interviews.
            </p>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="btn-primary px-8 py-4 rounded-2xl text-white font-semibold text-sm inline-flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
              <span>Get Started Now — It's Free</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-xs text-slate-400 bg-black/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('home')}>
            <img src="/logo.png" alt="PrepMate AI Logo" className="w-6 h-6 rounded-md shadow-md shadow-purple-500/20" />
            <span className="font-bold text-slate-200">PrepMate AI</span>
          </div>
          <p className="text-purple-300 font-semibold flex items-center justify-center gap-1.5 flex-wrap">
            <span>⚡ Built for</span>
            <span className="bg-purple-500/20 text-purple-200 px-2.5 py-1 rounded-full border border-purple-500/30">InnovaHack Chapter 1</span>
            <span>| Team Nexus</span>
          </p>
          <div className="flex gap-4 text-slate-400 font-medium">
            <button onClick={() => setScreen('pricing')} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => setScreen('about')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => setScreen('production')} className="hover:text-white transition-colors">System Status</button>
            <button onClick={() => setScreen('smart-notes')} className="hover:text-white transition-colors">Smart Notes</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
