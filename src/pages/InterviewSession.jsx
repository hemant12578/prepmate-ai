import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { generateInterviewQuestion, evaluateInterviewAnswer } from '../services/interviewService'
import InterviewQuestion from '../components/interview/InterviewQuestion'
import InterviewFeedback from '../components/interview/InterviewFeedback'
import { AlertCircle, RotateCw } from 'lucide-react'

export default function InterviewSession() {
  const { interviewConfig, setScreen, addSessionToHistory } = useApp()

  const [currentQ, setCurrentQ] = useState(0)
  const [questions, setQuestions] = useState([])
  const [scores, setScores] = useState([])

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const totalQ = interviewConfig?.questionCount || 8
  const pressureMode = interviewConfig?.pressureMode || 'Normal'

  useEffect(() => {
    if (!interviewConfig) {
      setScreen('interview-setup')
      return
    }
    fetchQuestion()
  }, [currentQ])

  async function fetchQuestion() {
    setLoading(true)
    setError(null)
    try {
      const q = await generateInterviewQuestion(interviewConfig, currentQ + 1, totalQ)
      setCurrentQuestion(q)
    } catch (err) {
      console.warn('Interview question generation failed:', err)
      setError('Could not generate question. Retrying...')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitAnswer({ answer, isHrQuestion }) {
    if (submitting) return
    setSubmitting(true)
    try {
      const fb = await evaluateInterviewAnswer(interviewConfig, currentQuestion.question, answer, isHrQuestion)
      setQuestions((prev) => [...prev, { question: currentQuestion.question, answer, ...fb }])
      setScores((prev) => [...prev, fb])
      setCurrentFeedback(fb)
    } catch (err) {
      console.warn('Interview evaluation failed:', err)
      setError('Could not evaluate answer. Proceeding...')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    setCurrentFeedback(null)
    setCurrentQuestion(null)
    if (currentQ >= totalQ - 1) {
      // Session finished
      const avg = scores.reduce((s, x) => s + (x.overallScore || 6), 0) / (scores.length || 1)
      const topicLabel = interviewConfig.category === 'job'
        ? `${interviewConfig.job.role} (${interviewConfig.job.round} Round)`
        : interviewConfig.category === 'school'
        ? `${interviewConfig.school.subject} Viva (${interviewConfig.school.grade})`
        : `College Interview (${interviewConfig.college.targetType})`

      addSessionToHistory({
        mode: 'interview',
        topic: topicLabel,
        category: interviewConfig.category,
        date: new Date().toLocaleDateString(),
        score: `${Math.round(avg * 10)}%`,
        questionsCount: questions.length
      })
      setScreen('interview-summary')
    } else {
      setCurrentQ((prev) => prev + 1)
    }
  }

  if (!interviewConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in">
        <div className="dot-pulse"><span /><span /><span /></div>
        <p className="text-xs text-red-300 font-medium">Redirecting to Interview Setup...</p>
      </div>
    )
  }

  if (loading || submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in">
        <div className="dot-pulse"><span /><span /><span /></div>
        <p className="text-xs text-red-300 font-medium">
          {submitting ? 'Interviewer Analyzing & Scoring Your Response...' : `Interviewer Preparing Question ${currentQ + 1} of ${totalQ}...`}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-3xl p-10 text-center animate-in border border-red-500/20 max-w-xl mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Question Generation Failed</h3>
        <p className="text-xs text-red-300 mb-6 max-w-sm mx-auto">{error}</p>
        <button
          onClick={fetchQuestion}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <RotateCw size={14} />
          <span>Retry Question</span>
        </button>
      </div>
    )
  }

  if (currentFeedback) {
    return (
      <InterviewFeedback
        feedback={currentFeedback}
        currentQ={currentQ}
        totalQ={totalQ}
        onNext={handleNextQuestion}
      />
    )
  }

  return (
    <InterviewQuestion
      questionData={currentQuestion}
      currentQ={currentQ}
      totalQ={totalQ}
      pressureMode={pressureMode}
      onSubmit={handleSubmitAnswer}
    />
  )
}
