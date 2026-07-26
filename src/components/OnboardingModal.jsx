import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { Sparkles, GraduationCap, Briefcase, Target, ArrowRight, Check } from 'lucide-react'

export default function OnboardingModal({ isOpen, onClose }) {
  const { saveProfile } = useApp()
  const { user } = useAuth()
  const [step, setStep] = useState(1)

  const [focus, setFocus] = useState('School Student')
  const [board, setBoard] = useState('CBSE')
  const [pattern, setPattern] = useState('NCERT Special')
  const [grade, setGrade] = useState('Class 10')
  const [domain, setDomain] = useState('Software Engineering')
  const [experience, setExperience] = useState('Fresher / Entry Level')
  const [targetGoal, setTargetGoal] = useState('')

  if (!isOpen) return null

  const handleFinish = () => {
    const profile = {
      focus,
      board: focus === 'School Student' ? board : null,
      pattern: focus === 'School Student' ? pattern : null,
      grade: focus === 'School Student' ? grade : null,
      domain: focus === 'Job Interview / Career' ? domain : null,
      experience: focus === 'Job Interview / Career' ? experience : null,
      targetGoal: targetGoal.trim() || (focus === 'School Student' ? `${board} ${grade} Excellence` : `${domain} Career Readiness`),
      completedAt: new Date().toISOString()
    }
    saveProfile(profile)
    onClose()
  }

  const firstName = user?.displayName?.split(' ')[0] || 'Friend'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="glass rounded-3xl p-8 max-w-lg w-full border border-purple-500/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 text-purple-400">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome to PrepMate AI, {firstName}!</h2>
          <p className="text-xs text-slate-400">Let's personalize your AI study & interview coach in 3 quick steps.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                s === step ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : s < step ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'
              }`}>
                {s < step ? <Check size={14} /> : s}
              </div>
              {s < 3 && <div className={`w-12 sm:w-16 h-0.5 ${s < step ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Focus */}
        {step === 1 && (
          <div className="space-y-4 animate-in">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              What is your primary learning focus?
            </label>

            {[
              { id: 'School Student', title: 'School Student (K-12 Board Prep)', desc: 'CBSE, ICSE, Bihar Board, UP Board, NCERT text questions', icon: GraduationCap },
              { id: 'Job Interview / Career', title: 'Job Interview / Career Prep', desc: 'Software Dev, Data Analyst, HR, Technical & Behavioral', icon: Briefcase },
              { id: 'Competitive Exams', title: 'Competitive Exams (JEE / NEET / GATE)', desc: 'Advanced problem solving and conceptual quizzes', icon: Target },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setFocus(item.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                    focus === item.id
                      ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${focus === item.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5 text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </button>
              )
            })}

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-6"
            >
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Specific Details */}
        {step === 2 && (
          <div className="space-y-5 animate-in">
            {focus === 'School Student' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Your Education Board
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['CBSE', 'ICSE', 'Bihar Board', 'UP Board', 'State Board', 'IB / IGCSE'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBoard(b)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                          board === b ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Curriculum / Textbook Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['NCERT Special', 'State Board Textbook', 'Reference Exemplar', 'Standard Core'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPattern(p)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                          pattern === p ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Your Grade / Class (Class 5 to 12+)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                          grade === g ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Target Career Domain
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Software Engineering', 'Data & AI Analytics', 'Product Management', 'Finance & Banking', 'Design / UX', 'Core Engineering'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDomain(d)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-left ${
                          domain === d ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Fresher', '1-3 Years', 'Senior Lead'].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => setExperience(exp)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all ${
                          experience === exp ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-2xl glass-light border border-white/10 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 btn-primary py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goal & Complete */}
        {step === 3 && (
          <div className="space-y-5 animate-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                What is your main goal? (Optional)
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder={focus === 'School Student' ? 'e.g. Score 95%+ in CBSE Class 10 Science' : 'e.g. Clear Software Engineer Technical Interview'}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/40"
              />
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Your Personal Prep Profile</h4>
              <p className="text-xs text-slate-300">Focus: <strong className="text-white">{focus}</strong></p>
              {focus === 'School Student' ? (
                <p className="text-xs text-slate-300">Board: <strong className="text-white">{board}</strong> • <strong className="text-white">{grade}</strong> ({pattern})</p>
              ) : (
                <p className="text-xs text-slate-300">Domain: <strong className="text-white">{domain}</strong> ({experience})</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-2xl glass-light border border-white/10 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 btn-primary py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <span>Save Profile & Start</span>
                <Check size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
