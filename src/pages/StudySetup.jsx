import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import BoardSelector from '../components/shared/BoardSelector'
import QuestionCounter from '../components/shared/QuestionCounter'
import { NCERT_SYLLABUS_DATA } from '../data/ncertSyllabus'
import {
  ChevronLeft, BookOpen, Sparkles, ArrowRight, Zap, Gauge, Flame, FileText,
  Upload, CheckCircle2, ExternalLink, Award, FileCode, Shield, RefreshCcw, Image as ImageIcon, AlertCircle, Eye
} from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import Tesseract from 'tesseract.js'

// Configure PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export default function StudySetup() {
  const { setScreen, startStudySession } = useApp()

  // Mode switcher: 'practice' vs 'exam'
  const [sessionType, setSessionType] = useState('practice') // 'practice' or 'exam'

  const [tab, setTab] = useState('school') // 'school', 'career', 'custom'

  // School fields
  const [board, setBoard] = useState('CBSE')
  const [grade, setGrade] = useState('Class 10')
  const [subject, setSubject] = useState('Science')
  const [chapter, setChapter] = useState('Life Processes')

  // Career / Custom fields
  const [customTopic, setCustomTopic] = useState('')

  // Common study fields
  const [format, setFormat] = useState('mixed') // 'mcq', 'true_false', 'subjective', 'mixed'
  const [difficulty, setDifficulty] = useState('Medium')
  const [questionCount, setQuestionCount] = useState(10)
  const [pyqMode, setPyqMode] = useState(false)

  // NCERT Syllabus & Textbook integration
  const [attachNcertSyllabus, setAttachNcertSyllabus] = useState(true)
  const [showNcertDetails, setShowNcertDetails] = useState(false)

  // Document & PYQ Upload states
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedDocText, setUploadedDocText] = useState('')
  const [parsingDoc, setParsingDoc] = useState(false)
  const [parseError, setParseError] = useState(null)

  const chapterChips = {
    Science: ['Life Processes', 'Chemical Reactions', 'Light & Optics', 'Electricity', 'Carbon Compounds'],
    Mathematics: ['Quadratic Equations', 'Trigonometry', 'Triangles', 'Real Numbers', 'Probability'],
    SocialScience: ['Nationalism in Europe', 'Resources & Dev', 'Power Sharing', 'Money & Credit'],
    ComputerScience: ['Data Structures', 'Python OOP', 'SQL Databases', 'Computer Networks']
  }

  // Get official NCERT syllabus data for current grade & subject
  const currentNcertInfo = NCERT_SYLLABUS_DATA[grade]?.[subject] || NCERT_SYLLABUS_DATA['Class 10']?.Science

  // Client-side file parser (PDF, Image OCR, Text/Doc)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFileName(file.name)
    setParsingDoc(true)
    setParseError(null)

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map(item => item.str)
          fullText += strings.join(' ') + '\n'
        }
        setUploadedDocText(fullText.trim())
      } else if (file.type.startsWith('image/')) {
        const { data: { text } } = await Tesseract.recognize(file, 'eng')
        setUploadedDocText(text.trim())
      } else {
        // Plain text or markdown or doc
        const text = await file.text()
        setUploadedDocText(text.trim())
      }
    } catch (err) {
      console.warn('File parse error:', err)
      setParseError('Could not parse file text. Using file title for reference.')
      setUploadedDocText(`Document file: ${file.name}`)
    } finally {
      setParsingDoc(false)
    }
  }

  const handleStart = () => {
    const finalSubject = tab === 'school' ? subject : 'General'
    const finalTopic = tab === 'school' ? chapter : customTopic.trim() || 'Data Structures'

    startStudySession({
      board,
      grade,
      subject: finalSubject,
      topic: finalTopic,
      format,
      difficulty,
      questionCount,
      pyqMode: pyqMode || sessionType === 'exam',
      isExamMode: sessionType === 'exam',
      uploadedDocText,
      uploadedFileName,
      ncertSyllabusContext: attachNcertSyllabus ? currentNcertInfo?.chapters?.map(c => c.name).join(', ') : null
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
      <div className="glass rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl space-y-6">
        <div className="h-36 relative overflow-hidden">
          <img src="/assets/study_mode.jpg" alt="Study Setup" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs text-purple-200 font-bold backdrop-blur-md">
              <BookOpen size={14} className="text-purple-400" />
              <span>Study Engine Setup</span>
            </div>
            {currentNcertInfo?.officialPdfUrl && (
              <a
                href={currentNcertInfo.officialPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-slate-200 border border-white/10 transition-colors backdrop-blur-md"
              >
                <span>NCERT Textbook PDF</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        <div className="p-6 pt-0 space-y-6">
          <div className="text-center border-b border-white/5 pb-5">
            <h1 className="text-2xl font-extrabold text-white mb-1">Customize Your Learning & Exam Session</h1>
            <p className="text-xs text-slate-400">Select Practice or Exam Mode, attach PYQs or NCERT syllabus standards, and generate tailored AI questions.</p>
          </div>

          {/* MODE SELECTION SWITCHER: Practice vs Exam Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Session Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setSessionType('practice'); setPyqMode(false) }}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  sessionType === 'practice'
                    ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  sessionType === 'practice' ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-slate-400'
                }`}>
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5">Practice Mode</h3>
                  <p className="text-[11px] text-slate-400 leading-normal">Adaptive practice with instant scoring, hints, and concept explanations.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setSessionType('exam'); setPyqMode(true) }}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  sessionType === 'exam'
                    ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  sessionType === 'exam' ? 'bg-red-500/30 text-red-300' : 'bg-white/5 text-slate-400'
                }`}>
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5">Exam Mode (PYQ Analysis)</h3>
                  <p className="text-[11px] text-slate-400 leading-normal">Strict mock exam paper style based on PYQs, timing & board patterns.</p>
                </div>
              </button>
            </div>
          </div>

          {/* 3 Top Category Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setTab('school')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                tab === 'school' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              School / K-12
            </button>
            <button
              type="button"
              onClick={() => setTab('career')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                tab === 'career' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Career / Tech
            </button>
            <button
              type="button"
              onClick={() => setTab('custom')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                tab === 'custom' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Topic
            </button>
          </div>

          {/* Tab Content 1: School */}
          {tab === 'school' && (
            <div className="space-y-5">
              <BoardSelector
                selectedBoard={board}
                onSelectBoard={setBoard}
                selectedClass={grade}
                onSelectClass={setGrade}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs"
                >
                  <option value="Science" className="bg-slate-900">Science (Physics, Chem, Bio)</option>
                  <option value="Mathematics" className="bg-slate-900">Mathematics</option>
                  <option value="SocialScience" className="bg-slate-900">Social Science (History, Civics, Geo)</option>
                  <option value="ComputerScience" className="bg-slate-900">Computer Science / IT</option>
                  <option value="English" className="bg-slate-900">English Literature & Grammar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Chapter / Topic
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(chapterChips[subject] || []).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setChapter(chip)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        chapter === chip
                          ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="Or type custom chapter name..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500"
                />
              </div>

              {/* OFFICIAL NCERT SYLLABUS & TEXTBOOK PANEL */}
              <div className="p-4 rounded-2xl bg-purple-500/[0.04] border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-purple-400" />
                    <h3 className="text-xs font-bold text-white">Official NCERT Textbook & Syllabus Standards</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNcertDetails(!showNcertDetails)}
                    className="text-[11px] text-purple-300 hover:text-white font-semibold flex items-center gap-1"
                  >
                    <span>{showNcertDetails ? 'Hide Syllabus' : 'View Syllabus Chapters'}</span>
                    <Eye size={12} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachNcertSyllabus}
                      onChange={(e) => setAttachNcertSyllabus(e.target.checked)}
                      className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/20"
                    />
                    <span>Attach official NCERT Syllabus context to AI prompt</span>
                  </label>

                  {currentNcertInfo?.officialPdfUrl && (
                    <a
                      href={currentNcertInfo.officialPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>NCERT Official PDF</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {showNcertDetails && currentNcertInfo?.chapters && (
                  <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[11px] text-slate-300 max-h-40 overflow-y-auto">
                    <p className="font-bold text-purple-300 uppercase tracking-wider text-[10px]">NCERT {grade} {subject} Chapters:</p>
                    <ul className="space-y-1 list-disc list-inside text-slate-400">
                      {currentNcertInfo.chapters.map((ch, idx) => (
                        <li key={idx} className="hover:text-slate-200">
                          <strong className="text-slate-200">{ch.name}</strong>: {ch.units.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content 2 & 3: Career / Custom */}
          {(tab === 'career' || tab === 'custom') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {tab === 'career' ? 'Career Domain / Skill' : 'Custom Topic / Concept'}
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={tab === 'career' ? 'e.g. Data Structures, React, System Design' : 'e.g. Quantum Physics, Photosynthesis'}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/40"
              />
            </div>
          )}

          {/* PYQ / CUSTOM DOCUMENT FILE UPLOAD SECTION */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold text-white">
                  {sessionType === 'exam' ? 'Upload Previous Year Question Paper (PYQ)' : 'Upload Custom Notes / Textbook (PDF, Image, Doc)'}
                </h3>
              </div>
              {sessionType === 'exam' && (
                <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Exam Mode Active
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              {sessionType === 'exam'
                ? 'Upload a PYQ paper (PDF/Image OCR). AI will analyze the paper pattern, question format, and difficulty to generate replica exam questions.'
                : 'Upload your class notes, textbook photo, or PDF to generate questions directly from your own material.'}
            </p>

            <label className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.01]">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload size={20} className="text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-300">Click or Drag & Drop File to Upload</span>
              <span className="text-[10px] text-slate-500 mt-1">Supports PDF, Image (PNG/JPG OCR), TXT</span>
            </label>

            {parsingDoc && (
              <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                <RefreshCcw size={14} className="animate-spin" />
                <span>Extracting document text & analyzing paper structure...</span>
              </div>
            )}

            {uploadedFileName && !parsingDoc && (
              <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span className="font-semibold truncate max-w-xs">{uploadedFileName}</span>
                </div>
                <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200 font-mono">
                  {uploadedDocText ? `${uploadedDocText.length} chars extracted` : 'Attached'}
                </span>
              </div>
            )}

            {parseError && (
              <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                <AlertCircle size={14} />
                <span>{parseError}</span>
              </div>
            )}
          </div>

          {/* Question Format */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Question Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'mixed', label: 'Mixed Format' },
                { id: 'mcq', label: 'MCQ (4 Options)' },
                { id: 'true_false', label: 'True / False' },
                { id: 'subjective', label: 'Short Answer' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormat(id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    format === id
                      ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Starting Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Easy', icon: Zap, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { id: 'Medium', icon: Gauge, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                { id: 'Hard', icon: Flame, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
              ].map(({ id, icon: Icon, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDifficulty(id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    difficulty === id
                      ? `${color} border-current`
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} />
                  <span>{id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <QuestionCounter value={questionCount} onChange={setQuestionCount} activeColor="purple" />

          {/* Start Button */}
          <button
            onClick={handleStart}
            className={`w-full py-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-xl transition-all ${
              sessionType === 'exam'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-500/20'
                : 'btn-primary shadow-purple-500/20'
            }`}
          >
            <span>{sessionType === 'exam' ? 'Launch Mock Exam Session (PYQ Analyzed)' : 'Start Practice Session'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
