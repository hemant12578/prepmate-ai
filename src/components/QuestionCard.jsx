import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { generateQuestion, evaluateAnswer } from '../services/openrouter'
import { getNextDifficulty } from '../utils/adaptiveDifficulty'
import { useVoiceInput } from '../hooks/useVoiceInput'
import Loader from './Loader'
import { Send, Mic, MicOff, Info, CheckCircle2, HelpCircle } from 'lucide-react'

export default function QuestionCard() {
  const {
    topic, mode, difficulty, setDifficulty, interviewType, questionFormat,
    currentQ, setCurrentQ, questions, setQuestions,
    scores, setScores, loading, setLoading,
    setError, currentQuestion, setCurrentQuestion,
    setCurrentFeedback, setScreen
  } = useApp()

  const [answer, setAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput()
  const savedTextRef = useRef('')

  // voice -> textarea
  useEffect(() => {
    if (isListening && transcript) {
      const base = savedTextRef.current
      setAnswer(base + (base ? ' ' : '') + transcript)
    }
  }, [transcript, isListening])

  useEffect(() => {
    if (!currentQuestion) fetchQuestion()
  }, [currentQ])

  async function fetchQuestion() {
    setLoading(true)
    setError(null)
    setSelectedOption(null)
    setAnswer('')
    try {
      const q = await generateQuestion(
        topic, mode, difficulty, currentQ + 1, interviewType, scores.map(s => s.score), questionFormat
      )
      setCurrentQuestion(q)
    } catch (err) {
      console.warn('question gen failed:', err)
      setError('Failed to generate question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt)
    setAnswer(opt)
  }

  async function handleSubmit() {
    const finalAns = selectedOption || answer
    if (!finalAns.trim() || submitting) return
    if (isListening) stopListening()

    setSubmitting(true)
    setError(null)
    try {
      const feedback = await evaluateAnswer(topic, mode, currentQuestion.question, finalAns)
      const qData = {
        question: currentQuestion.question,
        answer: finalAns,
        difficulty: currentQuestion.difficulty,
        ...feedback
      }
      setQuestions(prev => [...prev, qData])
      setScores(prev => [...prev, { score: feedback.score, difficulty: currentQuestion.difficulty }])
      setDifficulty(getNextDifficulty(difficulty, feedback.score))
      setCurrentFeedback(feedback)
      setAnswer('')
      setSelectedOption(null)
      setScreen('feedback')
    } catch (err) {
      console.warn('eval failed:', err)
      setError('Failed to evaluate your answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleMicToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      savedTextRef.current = answer
      resetTranscript()
      startListening()
    }
  }

  if (loading) return <Loader text="Generating your question" />
  if (!currentQuestion) return <Loader text="Loading" />

  const steps = Array.from({ length: 5 }, (_, i) => i)
  const diffColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Hard: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  const hasOptions = Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0

  return (
    <div className="animate-in">
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              i < currentQ ? 'bg-purple-500 text-white'
              : i === currentQ ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-300'
              : 'bg-white/5 border border-white/10 text-slate-500'
            }`}>
              {i + 1}
            </div>
            {i < 4 && <div className={`w-8 h-px ${i < currentQ ? 'bg-purple-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-7 animate-in delay-1 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <HelpCircle size={14} className="text-purple-400" />
            <span>Question {currentQ + 1} of 5 ({currentQuestion.format ? currentQuestion.format.toUpperCase() : 'STUDY'})</span>
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${diffColors[currentQuestion.difficulty] || diffColors.Medium}`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        <p className="text-lg text-white leading-relaxed mb-6 font-medium">{currentQuestion.question}</p>

        {currentQuestion.hint && (
          <div className="flex items-start gap-2 mb-6 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10">
            <Info size={14} className="text-purple-400 mt-0.5 shrink-0" />
            <p className="text-xs text-purple-300/80">{currentQuestion.hint}</p>
          </div>
        )}

        {/* MCQ Option Cards */}
        {hasOptions ? (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(opt)}
                className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                  selectedOption === opt
                    ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === opt && <CheckCircle2 size={16} className="text-purple-400 shrink-0" />}
              </button>
            ))}
          </div>
        ) : (
          /* Textarea for Subjective Answer */
          <div className="relative mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use the microphone..."
              rows={5}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
              disabled={submitting}
            />
            {isSupported && (
              <button
                onClick={handleMicToggle}
                type="button"
                className={`absolute right-3 top-3 p-2 rounded-xl transition-all ${
                  isListening ? 'bg-red-500/20 text-red-400 mic-active' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={isListening ? 'Stop recording' : 'Voice input'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-500">
            {!hasOptions && answer.length > 0 ? `${answer.split(' ').filter(Boolean).length} words` : ''}
          </span>
          <button
            onClick={handleSubmit}
            disabled={(!selectedOption && !answer.trim()) || submitting}
            className="btn-primary px-7 py-3 rounded-2xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
