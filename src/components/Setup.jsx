import { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  ChevronLeft, Zap, Gauge, Flame, ArrowRight, BookOpen, Briefcase, Award,
  Sparkles, Check, School, Code2, FileText, CheckCircle2, ListChecks, HelpCircle
} from 'lucide-react'

export default function Setup() {
  const {
    mode, setScreen, setTopic, setDifficulty, setInterviewType,
    topic, difficulty, interviewType, userProfile, curriculumData, setCurriculumData,
    questionFormat, setQuestionFormat
  } = useApp()

  const [category, setCategory] = useState(userProfile?.board ? 'school' : 'school')
  const [board, setBoard] = useState(userProfile?.board || 'CBSE')
  const [pattern, setPattern] = useState(userProfile?.pattern || 'NCERT Special')
  const [grade, setGrade] = useState(userProfile?.grade || 'Class 10')
  const [subject, setSubject] = useState('Science')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [customTopicInput, setCustomTopicInput] = useState('')

  const [careerRole, setCareerRole] = useState(userProfile?.domain || 'Software Developer')
  const [localDiff, setLocalDiff] = useState(difficulty)
  const [localType, setLocalType] = useState(interviewType)
  const [localFormat, setLocalFormat] = useState(questionFormat || 'mixed')

  // Subject chapters database
  const schoolChapters = {
    'Science': ['Chemical Reactions & Equations', 'Acids, Bases & Salts', 'Metals & Non-Metals', 'Life Processes', 'Control & Coordination', 'Light: Reflection & Refraction', 'Electricity', 'Magnetic Effects of Current'],
    'Mathematics': ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Statistics & Probability'],
    'Social Studies': ['Rise of Nationalism in Europe', 'Nationalism in India', 'Resources & Development', 'Power Sharing', 'Federalism', 'Money & Credit'],
    'Computer Science / IT': ['Python Programming Fundamentals', 'Data Structures & Arrays', 'SQL Database Queries', 'Networking & Cyber Security', 'HTML & CSS Web Design']
  }

  const careerRoles = [
    { title: 'Software Developer HR', type: 'HR', tag: 'Behavioral & Leadership' },
    { title: 'Data Analyst', type: 'Technical', tag: 'SQL, Python, Analytics' },
    { title: 'Frontend Engineer', type: 'Technical', tag: 'React, JS, Web Performance' },
    { title: 'System Design & Backend', type: 'Technical', tag: 'Scalability, Databases' },
    { title: 'Product Manager', type: 'Mixed', tag: 'Product Sense, Case Studies' },
  ]

  const boardsList = ['CBSE', 'ICSE', 'Bihar Board', 'UP Board', 'Maharashtra Board', 'IB / IGCSE']
  const patternsList = ['NCERT Special', 'State Board Textbook', 'Reference Exemplar']
  const gradesList = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College / Univ']

  const handleStart = () => {
    let finalTopic = ''
    if (category === 'school') {
      const topicDetail = selectedChapter || customTopicInput || subject
      finalTopic = `${board} ${grade} (${pattern}) — ${subject}: ${topicDetail}`
      setCurriculumData({ category, board, pattern, grade, subject, chapter: topicDetail })
    } else if (category === 'career') {
      finalTopic = customTopicInput || careerRole
    } else {
      finalTopic = customTopicInput || topic || 'General Knowledge'
    }

    if (!finalTopic.trim()) return
    setTopic(finalTopic.trim())
    setDifficulty(localDiff)
    setInterviewType(localType)
    setQuestionFormat(localFormat)
    setScreen('question')
  }

  const diffs = [
    { label: 'Easy', icon: Zap, active: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' },
    { label: 'Medium', icon: Gauge, active: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
    { label: 'Hard', icon: Flame, active: 'bg-red-500/20 border-red-500/30 text-red-400' },
  ]

  const formatOptions = [
    { id: 'mixed', label: 'Mixed (MCQ + Subjective)', icon: ListChecks, desc: 'Balanced combination of options & written/voice' },
    { id: 'mcq', label: 'MCQ (Multiple Choice)', icon: CheckCircle2, desc: '4 interactive options A, B, C, D' },
    { id: 'subjective', label: 'Short Answer / Subjective', icon: FileText, desc: 'Deep written or voice explanations' },
    { id: 'true_false', label: 'True / False', icon: HelpCircle, desc: 'Quick binary conceptual checks' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-6">
      <button
        onClick={() => setScreen('home')}
        className="self-start flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors animate-in"
      >
        <ChevronLeft size={16} />
        <span>Back to Mode Selection</span>
      </button>

      <div className="glass rounded-3xl p-6 sm:p-8 w-full max-w-2xl animate-in delay-1 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs text-purple-300 mb-3 border border-purple-500/20">
            <Sparkles size={12} />
            <span>Guided AI Session Configuration</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {mode === 'study' ? 'Study Topic Setup' : 'Interview Prep Setup'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Select your grade (Class 5–12), education board, topic, and preferred question format.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8 bg-white/[0.02] p-1.5 rounded-2xl border border-white/[0.06]">
          <button
            onClick={() => setCategory('school')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              category === 'school' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <School size={15} />
            <span>School / K-12</span>
          </button>
          <button
            onClick={() => setCategory('career')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              category === 'career' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase size={15} />
            <span>Career / Job</span>
          </button>
          <button
            onClick={() => setCategory('custom')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              category === 'custom' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={15} />
            <span>Custom Topic</span>
          </button>
        </div>

        {/* School Cascading Workflow */}
        {category === 'school' && (
          <div className="space-y-6 animate-in">
            {/* Step 1: Board & Pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  1. Education Board
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {boardsList.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBoard(b)}
                      className={`py-2 px-1.5 rounded-xl text-[11px] font-medium border transition-all text-center ${
                        board === b ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-semibold' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  2. Curriculum / Textbook
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {patternsList.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPattern(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-left flex items-center justify-between ${
                        pattern === p ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-semibold' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                      }`}
                    >
                      <span>{p}</span>
                      {pattern === p && <Check size={14} className="text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Class (Grades 5-12) & Subject */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  3. Select Class / Grade (Class 5 to 12+)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {gradesList.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                        grade === g ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-semibold' : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  4. Select Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value)
                    setSelectedChapter('')
                  }}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/40"
                >
                  {Object.keys(schoolChapters).map((subj) => (
                    <option key={subj} value={subj} className="bg-slate-900 text-white">{subj}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Chapter / Topic Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                5. Select Chapter or Type Custom Chapter
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(schoolChapters[subject] || []).map((chap) => (
                  <button
                    key={chap}
                    type="button"
                    onClick={() => {
                      setSelectedChapter(chap)
                      setCustomTopicInput('')
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all text-left ${
                      selectedChapter === chap
                        ? 'bg-purple-500/25 border-purple-500/50 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => {
                  setCustomTopicInput(e.target.value)
                  if (e.target.value) setSelectedChapter('')
                }}
                placeholder="Or type specific topic (e.g. Ohm's Law, Light Refraction)"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/30"
              />
            </div>
          </div>
        )}

        {/* Career & Tech Workflow */}
        {category === 'career' && (
          <div className="space-y-6 animate-in">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Target Job Role / Domain
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {careerRoles.map((r) => (
                  <button
                    key={r.title}
                    type="button"
                    onClick={() => {
                      setCareerRole(r.title)
                      setLocalType(r.type)
                      setCustomTopicInput('')
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      careerRole === r.title && !customTopicInput
                        ? 'bg-blue-500/20 border-blue-500/40 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{r.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-blue-300">{r.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{r.tag}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Or Type Custom Job Role
              </label>
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="e.g. Mobile Developer, DevOps Engineer, QA Automation"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500/30"
              />
            </div>
          </div>
        )}

        {/* Custom Topic Workflow */}
        {category === 'custom' && (
          <div className="space-y-4 animate-in">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Enter Any Topic, Subject, or Quiz Concept
            </label>
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="e.g. Quantum Computing, Photosynthesis, Ancient History, Microservices"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/30"
              autoFocus
            />
          </div>
        )}

        {/* Question Format Selector */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Question Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {formatOptions.map((f) => {
              const Icon = f.icon
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setLocalFormat(f.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    localFormat === f.id
                      ? 'bg-purple-500/20 border-purple-500/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                  }`}
                >
                  <Icon size={16} className={`mt-0.5 shrink-0 ${localFormat === f.id ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-xs font-semibold text-white mb-0.5">{f.label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{f.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Starting Difficulty Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {diffs.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                onClick={() => setLocalDiff(label)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
                  localDiff === label
                    ? active
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Start CTA */}
        <button
          onClick={handleStart}
          className="w-full btn-primary py-4 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 mt-8 shadow-xl shadow-purple-500/20 hover:scale-[1.01] active:scale-100 transition-all"
        >
          <span>Start AI Session</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
