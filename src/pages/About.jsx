import React, { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import TiltCard from '../components/3d/TiltCard'
import ThreeErrorBoundary from '../components/3d/ThreeErrorBoundary'
import AnimatedCounter from '../components/3d/AnimatedCounter'
import {
  ChevronLeft, Sparkles, Target, Shield, Cpu, Zap, Users, Globe,
  BookOpen, Briefcase, Award, CheckCircle2, ArrowRight, FileText,
  Layers, Code2, Heart, Flame
} from 'lucide-react'

// Lazy load Three.js 3D canvas elements for desktop
const ParticleGrid = lazy(() => import('../components/3d/ParticleGrid'))
const HeroOrb = lazy(() => import('../components/3d/HeroOrb'))

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

const fade3D = {
  hidden: { opacity: 0, y: 30, rotateX: 12 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export default function About() {
  const { setScreen } = useApp()

  const pillars = [
    {
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      gradient: 'from-[#140b2e] to-[#0a0618]',
      title: 'Adaptive K-12 & Academic Study Engine',
      desc: 'Tailored practice across Class 5–12+ and Competitive Exams with custom NCERT & state board alignment, concept explanations, and memory tricks.'
    },
    {
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      gradient: 'from-[#1f1707] to-[#0d0903]',
      title: 'Exam Mode & PYQ Paper Pattern Analysis',
      desc: 'Upload Previous Year Question (PYQ) papers. AI analyzes paper structure, weighting, and difficulty to generate replica mock exam questions.'
    },
    {
      icon: FileText,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
      gradient: 'from-[#071d18] to-[#030e0b]',
      title: 'Official NCERT Textbook & Syllabus Integration',
      desc: 'Direct access to official NCERT textbook PDFs (ncert.nic.in) and chapter-by-chapter syllabus standards for Class 6–12 Science, Math, Social Science & English.'
    },
    {
      icon: Briefcase,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      gradient: 'from-[#21090d] to-[#0f0406]',
      title: 'Corporate & Viva Interview Simulator',
      desc: 'Simulates School Vivas, College Entrance Interviews, and Corporate Job Interviews (HR, Technical, System Design) with 90s Pressure Mode and STAR format evaluation.'
    },
    {
      icon: Cpu,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-[#081f13] to-[#040e09]',
      title: 'PrepNotes Multi-Source Hub & OCR',
      desc: 'Upload custom PDFs, class notes, or textbook photos via client-side Tesseract.js OCR to generate combined AI summaries, 3D flashcards, chat, and audio podcasts.'
    },
    {
      icon: Shield,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      gradient: 'from-[#071329] to-[#030914]',
      title: 'Enterprise Multi-Model OpenRouter Architecture',
      desc: 'Powered by an automated failover chain prioritizing high-performance AI models for sub-second, resilient response generation.'
    }
  ]

  const stats3D = [
    { label: 'AI Models', value: 5, suffix: '+', color: 'text-purple-400' },
    { label: 'NCERT Grades', value: 12, suffix: ' Classes', color: 'text-teal-400' },
    { label: 'Pricing Plans', value: 3, suffix: ' Tiers', color: 'text-emerald-400' },
    { label: 'Avg Latency', value: 1.2, suffix: 's', color: 'text-amber-400' }
  ]

  const techStack = [
    { name: 'React 18 & Vite', category: 'Frontend Core', desc: 'Ultra-fast HMR and optimized production bundle' },
    { name: 'Three.js & React Three Fiber', category: '3D Graphics', desc: 'Hardware-accelerated 3D canvases, floating particle grids, and 3D mesh lighting' },
    { name: 'Tailwind CSS', category: 'Design System', desc: 'Custom glassmorphism design tokens & 3D CSS perspective transforms' },
    { name: 'Firebase v10 Auth', category: 'Authentication', desc: 'Google Single Sign-On and user identity management' },
    { name: 'OpenRouter AI API', category: 'Multi-Model AI', desc: 'Smart fallback routing across LLaMA, Gemma, and Claude' },
    { name: 'Razorpay Gateway', category: 'Monetization', desc: 'Secure UPI, Cards, NetBanking payments with HMAC-SHA256 signature verification for PRO & ELITE plans' },
    { name: 'pdfjs-dist', category: 'Document Processing', desc: 'Client-side PDF page-by-page text extraction for PYQ papers' },
    { name: 'Tesseract.js OCR', category: 'Vision & OCR', desc: 'Client-side optical character recognition for textbook photos' },
    { name: 'NCERT Syllabus Database', category: 'Curriculum Standards', desc: 'Official chapter mapping and NCERT PDF download links' },
    { name: 'Web Speech API', category: 'Voice & Audio', desc: 'Browser-native SpeechSynthesis player & SpeechRecognition' }
  ]

  return (
    <div className="animate-in max-w-5xl mx-auto space-y-12 py-6 relative">
      {/* 3D Particle Grid Canvas Background — desktop only */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <ThreeErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <ParticleGrid />
            </Suspense>
          </ThreeErrorBoundary>
        </div>
      )}

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-light text-xs text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <Sparkles size={13} className="text-purple-400 animate-pulse" />
          <span>About PrepMate AI & 3D Engine</span>
        </div>
      </div>

      {/* 3D HERO BANNER WITH INTERACTIVE THREE.JS ORB */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 glass rounded-3xl p-5 sm:p-8 md:p-12 border border-purple-500/30 shadow-2xl overflow-hidden bg-gradient-to-r from-[#0d152e] via-[#0f172a] to-[#1a0b36]"
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-semibold">
              <Globe size={14} className="text-purple-400" />
              <span>Next-Gen AI Learning Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Democratizing Personalized <br />
              <span className="text-gradient">AI Education</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              PrepMate AI combines 3D interactive graphics, Exam Mode PYQ analysis, official NCERT textbook integration, real-time rubric scoring, PrepNotes multi-source analysis, and corporate interview pressure simulation into a single, accessible platform.
            </p>
          </div>

          {/* Interactive Three.js 3D Floating Orb */}
          {!isMobile && (
            <div className="md:col-span-4 h-56 relative flex items-center justify-center">
              <ThreeErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  <HeroOrb />
                </Suspense>
              </ThreeErrorBoundary>
            </div>
          )}
        </div>
      </motion.div>

      {/* 3D INTERACTIVE STATS GRID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats3D.map((stat, i) => (
          <TiltCard
            key={i}
            options={{ max: 15, speed: 400, glare: true, 'max-glare': 0.2, scale: 1.03 }}
            className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 text-center space-y-1 hover:border-purple-500/30 transition-all shadow-xl bg-white/[0.02]"
          >
            <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${stat.color}`}>
              <AnimatedCounter end={stat.value} />
              <span className="text-xl sm:text-2xl font-bold">{stat.suffix}</span>
            </p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </TiltCard>
        ))}
      </motion.div>

      {/* 3D HARDWARE-ACCELERATED TILT CARDS FOR CORE PILLARS */}
      <div className="relative z-10 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Core Platform Pillars</h2>
          <p className="text-xs text-slate-400">Tap or hover over any card to experience 3D perspective tilt.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={cardStagger}
          initial="hidden"
          animate="visible"
        >
          {pillars.map((p, idx) => {
            const Icon = p.icon
            return (
              <motion.div key={idx} variants={fade3D}>
                <TiltCard
                  options={{ max: 12, speed: 400, glare: true, 'max-glare': 0.25, scale: 1.03 }}
                  className={`glass rounded-3xl p-6 border border-white/10 space-y-4 hover:border-purple-500/40 transition-all shadow-xl bg-gradient-to-b ${p.gradient} flex flex-col justify-between h-full group cursor-pointer`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl ${p.bg} flex items-center justify-center ${p.color} shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform`}>
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pillar 0{idx + 1}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">{p.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore Architecture</span>
                    <ArrowRight size={14} />
                  </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* TECHNICAL ARCHITECTURE STACK */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 glass rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6 shadow-2xl bg-[#080e22]"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 mb-2 font-semibold">
            <Code2 size={13} />
            <span>Enterprise Stack</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Production Tech Stack</h2>
          <p className="text-xs text-slate-400">Built with modern web standards, Three.js 3D acceleration, NCERT syllabus standards, and zero-dependency client processing.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((tech, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 hover:border-purple-500/20 transition-colors">
              <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{tech.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold">{tech.category}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* MISSION BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 glass rounded-3xl p-8 sm:p-10 border border-purple-500/30 text-center space-y-5 shadow-2xl bg-gradient-to-r from-[#110928] via-[#0d1024] to-[#071328]"
      >
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto shadow-lg shadow-purple-500/10">
          <Heart size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Our Mission</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Every student and job aspirant deserves access to high-quality, personalized tutoring, official curriculum standards, and realistic interview feedback. PrepMate AI bridges the gap between passive studying and active recall, empowering learners worldwide to achieve academic excellence and career success.
        </p>
        <button
          onClick={() => setScreen('home')}
          className="btn-primary px-8 py-3.5 rounded-2xl text-xs font-bold text-white inline-flex items-center gap-2 shadow-xl shadow-purple-500/25 hover:scale-105 transition-transform"
        >
          <span>Start Practicing Now</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  )
}
