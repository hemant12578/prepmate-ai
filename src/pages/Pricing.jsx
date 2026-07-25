import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { processRazorpayPayment } from '../services/razorpay'
import TiltCard from '../components/3d/TiltCard'
import {
  ChevronLeft, Sparkles, Check, ArrowRight, Zap, Award, ShieldCheck,
  BookOpen, Briefcase, Star, HelpCircle, Layers, Flame, Mic, FileText,
  Calendar, FileDown, Crown, CheckCircle2, Loader2, Shield
} from 'lucide-react'

export default function Pricing() {
  const { setScreen, setError, saveProfile, userProfile } = useApp()
  const { user, signInWithGoogle } = useAuth()
  const [annualBilling, setAnnualBilling] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [successPayment, setSuccessPayment] = useState(null)

  const handleAction = async (plan) => {
    if (!user) {
      try {
        await signInWithGoogle()
      } catch (e) {
        setError('Please sign in to choose a plan.')
        return
      }
    }

    if (plan.key === 'free') {
      saveProfile({ ...(userProfile || {}), plan: 'FREE' })
      setScreen('home')
      return
    }

    // Determine Razorpay payment amount in paise
    let amountPaise = 19900
    if (plan.key === 'pro') {
      amountPaise = annualBilling ? 178800 : 19900 // ₹149x12=1788 or ₹199
    } else if (plan.key === 'elite') {
      amountPaise = annualBilling ? 478800 : 49900 // ₹399x12=4788 or ₹499
    }

    setPaymentLoading(true)
    processRazorpayPayment({
      planName: `${plan.name} (${annualBilling ? 'Annual' : 'Monthly'})`,
      amountPaise: amountPaise,
      user: user,
      onSuccess: (paymentData) => {
        setPaymentLoading(false)
        saveProfile({
          ...(userProfile || {}),
          plan: plan.name,
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          subscribedAt: new Date().toISOString(),
        })
        setSuccessPayment({
          ...paymentData,
          planName: plan.name,
          amountPaid: `₹${(amountPaise / 100).toLocaleString('en-IN')}`,
        })
      },
      onError: (errMsg) => {
        setPaymentLoading(false)
        if (!errMsg.includes('cancelled')) {
          setError(errMsg)
        }
      },
    })
  }

  const plans = [
    {
      key: 'free',
      name: 'FREE',
      badge: 'Free Forever',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      period: '/month',
      desc: 'Essential practice for students starting their self-study journey.',
      buttonText: 'Get Started',
      buttonBg: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
      popular: false,
      features: [
        '10 questions per day',
        'Study Mode only',
        'Basic feedback',
        'Official NCERT Textbook PDF links',
        'Standard response speed'
      ]
    },
    {
      key: 'pro',
      name: 'PRO',
      badge: 'MOST POPULAR 🚀',
      badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-lg shadow-purple-500/20',
      priceMonthly: '₹199',
      priceAnnual: '₹149',
      period: '/month (~$2.4)',
      desc: 'Supercharge your learning with unlimited questions and NotebookLM Smart Notes.',
      buttonText: 'Start Free Trial →',
      buttonBg: 'btn-primary text-white shadow-xl shadow-purple-500/30 hover:scale-[1.02]',
      popular: true,
      features: [
        'Unlimited questions',
        'All modes (Study & Interview)',
        'Smart Notes (PDF + YouTube)',
        '3D Flashcards generator',
        'Audio overview podcasts',
        'Detailed teacher feedback & mnemonics'
      ]
    },
    {
      key: 'elite',
      name: 'ELITE',
      badge: 'BEST VALUE 👑',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20',
      priceMonthly: '₹499',
      priceAnnual: '₹399',
      period: '/month (~$6)',
      desc: 'Ultimate academic & interview preparation suite for competitive aspirants.',
      buttonText: 'Go Elite →',
      buttonBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-extrabold shadow-xl shadow-amber-500/25 hover:scale-[1.02]',
      popular: false,
      features: [
        'Everything in Pro',
        'Voice speech recognition input',
        '90s Pressure Mode countdown timer',
        'Priority sub-second AI routing',
        'Download PDF performance reports',
        'Parent dashboard analytics',
        'Exam calendar integration'
      ]
    }
  ]

  const faqs = [
    {
      q: 'Is my payment secure with Razorpay?',
      a: 'Yes! All transactions are encrypted via 256-bit SSL and processed directly through Razorpay Standard Checkout with HMAC-SHA256 signature verification.'
    },
    {
      q: 'Can I start with the Free plan and upgrade later?',
      a: 'Yes! You can use the FREE plan with 10 questions per day forever. Upgrade to PRO or ELITE anytime with 1-click Razorpay payment.'
    },
    {
      q: 'How does the Voice Recognition feature work in ELITE?',
      a: 'ELITE users can speak their answers directly into their microphone using our Web Speech API integration. AI transcribes and evaluates spoken clarity and technical precision in real time.'
    },
    {
      q: 'What is included in the Smart Notes (PDF + YouTube) feature?',
      a: 'You can upload PDFs, class notes, or paste YouTube video links to generate multi-source summaries, 3D flashcards, AI chat tutors, and audio overview podcasts.'
    }
  ]

  return (
    <div className="animate-in max-w-5xl mx-auto space-y-10 py-6 relative">
      {/* SUCCESS PAYMENT MODAL */}
      {successPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in">
          <div className="glass rounded-3xl p-8 max-w-md w-full border border-emerald-500/40 text-center space-y-5 shadow-2xl bg-[#091512]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Payment Verified! 🎉</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">Welcome to {successPayment.planName}!</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Your payment of <span className="font-bold text-emerald-300">{successPayment.amountPaid}</span> was successfully processed via Razorpay.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left text-xs space-y-1 text-slate-400">
              <p><span className="font-semibold text-slate-300">Payment ID:</span> {successPayment.paymentId}</p>
              <p><span className="font-semibold text-slate-300">Order ID:</span> {successPayment.orderId}</p>
            </div>

            <button
              onClick={() => { setSuccessPayment(null); setScreen('home') }}
              className="w-full py-3.5 rounded-2xl btn-primary text-xs font-bold text-white shadow-xl shadow-purple-500/20"
            >
              Start Practicing with {successPayment.planName}
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-light text-xs text-purple-300 border border-purple-500/30">
          <Sparkles size={13} className="text-purple-400 animate-pulse" />
          <span>Razorpay Secure Standard Checkout</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Invest in Your <span className="text-gradient">Academic Success</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Choose the plan that fits your learning goals. Supercharge your prep with unlimited AI question generation, NotebookLM Smart Notes, and voice interview simulation.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-full glass border border-white/10 mt-2 shadow-xl">
          <button
            onClick={() => setAnnualBilling(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              !annualBilling ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnualBilling(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              annualBilling ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual (Save 25%)</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-500/30">SAVE</span>
          </button>
        </div>
      </div>

      {/* 3D Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <TiltCard
            key={plan.key}
            options={{ max: 10, speed: 400, glare: true, 'max-glare': 0.25, scale: 1.02 }}
            className={`glass rounded-3xl p-7 border ${
              plan.popular
                ? 'border-purple-500/60 shadow-2xl shadow-purple-500/25 bg-gradient-to-b from-[#180c38] via-[#0e1329] to-[#070b18] scale-[1.02]'
                : plan.key === 'elite'
                ? 'border-amber-500/40 shadow-xl shadow-amber-500/10 bg-gradient-to-b from-[#1c1408] via-[#0f1024] to-[#070a18]'
                : 'border-white/10 bg-white/[0.02]'
            } flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400" />
            )}

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${plan.badgeBg}`}>
                  {plan.badge}
                </span>
                {plan.key === 'elite' && <Crown size={18} className="text-amber-400 animate-pulse" />}
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">{plan.desc}</p>
              </div>

              <div className="py-3 border-y border-white/10 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {annualBilling ? plan.priceAnnual : plan.priceMonthly}
                </span>
                <span className="text-xs font-semibold text-slate-400">{plan.period}</span>
              </div>

              {/* Feature Bullet Points */}
              <div className="space-y-2.5 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features Included:</p>
                {plan.features.map((feat, fi) => (
                  <div key={fi} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 size={16} className={`${plan.popular ? 'text-purple-400' : plan.key === 'elite' ? 'text-amber-400' : 'text-blue-400'} shrink-0 mt-0.5`} />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={() => handleAction(plan)}
                disabled={paymentLoading}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${plan.buttonBg} disabled:opacity-50`}
              >
                {paymentLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{plan.buttonText}</span>
                  </>
                )}
              </button>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="glass rounded-3xl p-8 border border-white/10 space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-1">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about Razorpay payments, plans and features.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle size={14} className="text-purple-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-300 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
