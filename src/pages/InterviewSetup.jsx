import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import BoardSelector from '../components/shared/BoardSelector'
import QuestionCounter from '../components/shared/QuestionCounter'
import { ChevronLeft, Briefcase, GraduationCap, School, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'

export default function InterviewSetup() {
  const { setScreen, startInterviewSession } = useApp()

  const [category, setCategory] = useState('job') // 'school', 'college', 'job'

  // Card 1: School Viva
  const [schoolBoard, setSchoolBoard] = useState('CBSE')
  const [schoolGrade, setSchoolGrade] = useState('Class 10')
  const [schoolSubject, setSchoolSubject] = useState('Science')
  const [schoolTopic, setSchoolTopic] = useState('Life Processes')
  const [vivaStyle, setVivaStyle] = useState('Oral Viva')

  // Card 2: College Admission
  const [collegeTarget, setCollegeTarget] = useState('IIT/NIT')
  const [collegeRound, setCollegeRound] = useState('Personal Interview')
  const [collegeFocus, setCollegeFocus] = useState('Academic Background')

  // Card 3: Job Interview
  const [expLevel, setExpLevel] = useState('Fresher (0-1 yr)')
  const [jobRole, setJobRole] = useState('Frontend Developer')
  const [jobRound, setJobRound] = useState('Technical')
  const [companyType, setCompanyType] = useState('Product Company')

  // Common Bottom Fields
  const [pressureMode, setPressureMode] = useState('Normal') // 'Relaxed', 'Normal', 'Pressure'
  const [questionCount, setQuestionCount] = useState(8)

  const jobRoleSuggestions = [
    'Frontend Developer', 'Backend Developer', 'Data Analyst',
    'Data Scientist', 'Product Manager', 'UI/UX Designer',
    'DevOps Engineer', 'Full Stack Developer', 'ML Engineer', 'Business Analyst'
  ]

  const handleStart = () => {
    startInterviewSession({
      category,
      school: { board: schoolBoard, grade: schoolGrade, subject: schoolSubject, topic: schoolTopic, vivaStyle },
      college: { targetType: collegeTarget, round: collegeRound, focusArea: collegeFocus },
      job: { expLevel, role: jobRole, round: jobRound, companyType },
      pressureMode,
      questionCount
    })
  }

  return (
    <div className="animate-in max-w-3xl mx-auto space-y-6 py-4">
      {/* Back Button */}
      <button
        onClick={() => setScreen('home')}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Main Container */}
      <div className="glass rounded-3xl overflow-hidden border border-red-500/20 shadow-2xl space-y-6 bg-[#070d1e]">
        <div className="h-32 relative overflow-hidden">
          <img src="/assets/interview_mode.jpg" alt="Interview Setup" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e] via-transparent to-transparent" />
        </div>

        <div className="p-6 pt-0 space-y-7">
          {/* Header */}
          <div className="text-center border-b border-white/5 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-300 mb-3 font-semibold">
              <Briefcase size={14} />
              <span>Interview Prep Setup</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Simulate Real Interview Pressure</h1>
            <p className="text-xs text-slate-400">Choose your interview track: School Viva, College Entrance, or Career Job Interview.</p>
          </div>

          {/* 3 BIG CARDS AT TOP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: School Viva */}
            <div
              onClick={() => setCategory('school')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                category === 'school'
                  ? 'bg-red-500/15 border-red-500/40 text-white shadow-lg'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/15'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400 mb-3">
                  <School size={20} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">School Viva</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Oral practical exam & board viva simulation for K-12 students.
                </p>
              </div>
              {category === 'school' && <span className="mt-4 text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Selected</span>}
            </div>

            {/* Card 2: College Admission */}
            <div
              onClick={() => setCategory('college')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                category === 'college'
                  ? 'bg-red-500/15 border-red-500/40 text-white shadow-lg'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/15'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">College Entrance</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  IIT/NIT, AIIMS, IIM, or Abroad University admission interview.
                </p>
              </div>
              {category === 'college' && <span className="mt-4 text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Selected</span>}
            </div>

            {/* Card 3: Job Interview */}
            <div
              onClick={() => setCategory('job')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                category === 'job'
                  ? 'bg-red-500/15 border-red-500/40 text-white shadow-lg'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/15'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Job / Career</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  HR, Technical, or System Design interview for job seekers & freshers.
                </p>
              </div>
              {category === 'job' && <span className="mt-4 text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Selected</span>}
            </div>
          </div>

          {/* DYNAMIC CONFIGURATION FORM BASED ON CATEGORY */}

          {/* Category 1: School Viva Form */}
          {category === 'school' && (
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <BoardSelector
                selectedBoard={schoolBoard}
                onSelectBoard={setSchoolBoard}
                selectedClass={schoolGrade}
                onSelectClass={setSchoolGrade}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject & Topic</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={schoolSubject}
                    onChange={(e) => setSchoolSubject(e.target.value)}
                    placeholder="Subject (e.g. Physics)"
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={schoolTopic}
                    onChange={(e) => setSchoolTopic(e.target.value)}
                    placeholder="Chapter (e.g. Optics)"
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Viva Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Oral Viva', 'Written Exam', 'Practical Based'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setVivaStyle(style)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        vivaStyle === style
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category 2: College Admission Form */}
          {category === 'college' && (
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target College Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['IIT/NIT', 'Medical (AIIMS)', 'MBA (IIM)', 'General College', 'Abroad Univ'].map((tgt) => (
                    <button
                      key={tgt}
                      type="button"
                      onClick={() => setCollegeTarget(tgt)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left truncate ${
                        collegeTarget === tgt
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                      }`}
                    >
                      {tgt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interview Round</label>
                  <select
                    value={collegeRound}
                    onChange={(e) => setCollegeRound(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 text-white text-xs"
                  >
                    <option value="Personal Interview" className="bg-slate-900">Personal Interview (PI)</option>
                    <option value="Group Discussion" className="bg-slate-900">Group Discussion (GD)</option>
                    <option value="Statement of Purpose Review" className="bg-slate-900">Statement of Purpose (SOP) Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Focus Area</label>
                  <select
                    value={collegeFocus}
                    onChange={(e) => setCollegeFocus(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 text-white text-xs"
                  >
                    <option value="Academic Background" className="bg-slate-900">Academic Background</option>
                    <option value="Extracurriculars" className="bg-slate-900">Extracurriculars & Leadership</option>
                    <option value="Future Goals" className="bg-slate-900">Future Career Goals</option>
                    <option value="Why This College" className="bg-slate-900">Why This College / SOP</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Category 3: Job Interview Form */}
          {category === 'job' && (
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Experience Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Fresher (0-1 yr)', 'Junior (1-3 yrs)', 'Mid-level (3-6 yrs)', 'Senior (6+ yrs)'].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExpLevel(exp)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        expLevel === exp
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                      }`}
                    >
                      {exp.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Job Role</label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {jobRoleSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setJobRole(suggestion)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        jobRole === suggestion
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="Or type custom job role..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interview Round</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['HR', 'Technical', 'Mixed'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setJobRound(r)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          jobRound === r
                            ? 'bg-red-500/20 border-red-500/40 text-red-300'
                            : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                        }`}
                      >
                        {r} Round
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Company Type</label>
                  <select
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 text-white text-xs"
                  >
                    <option value="Product Company" className="bg-slate-900">Product Company</option>
                    <option value="Startup" className="bg-slate-900">Startup</option>
                    <option value="MNC" className="bg-slate-900">MNC</option>
                    <option value="Service Company" className="bg-slate-900">Service Company</option>
                    <option value="FAANG Level" className="bg-slate-900">FAANG Level</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* COMMON BOTTOM FIELDS FOR ALL 3 TYPES */}

          {/* Interview Pressure Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-red-400" />
              <span>Interview Pressure Mode</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'Relaxed', label: 'Relaxed Mode', desc: 'No timer, hints, encouraging' },
                { id: 'Normal', label: 'Normal Round', desc: 'No timer, professional evaluation' },
                { id: 'Pressure', label: 'Pressure Mode', desc: '90s timer per answer, strict eval' },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPressureMode(id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    pressureMode === id
                      ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-md'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10'
                  }`}
                >
                  <p className="text-xs font-bold text-white mb-0.5">{label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <QuestionCounter value={questionCount} onChange={setQuestionCount} options={[5, 8, 10, 15]} activeColor="red" />

          {/* Start Button */}
          <div>
            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-500/20"
            >
              <span>Start Interview Session</span>
              <ArrowRight size={16} />
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              You'll be evaluated on content accuracy, communication clarity, and structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
