import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { generateStudyQuestion, evaluateStudyAnswer } from '../services/studyService'
import StudyQuestion from '../components/study/StudyQuestion'
import StudyFeedback from '../components/study/StudyFeedback'

export default function StudySession() {
  const { studyConfig, setScreen, addSessionToHistory, setLastSessionScores } = useApp()

  const [currentQ, setCurrentQ] = useState(0)
  const [questions, setQuestions] = useState([])
  const [scores, setScores] = useState([])

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const totalQ = studyConfig?.questionCount || 10

  useEffect(() => {
    if (!studyConfig) {
      setScreen('study-setup')
      return
    }
    fetchQuestion()
  }, [currentQ])

  async function fetchQuestion() {
    setLoading(true)
    setError(null)
    try {
      const q = await generateStudyQuestion(studyConfig, currentQ + 1, totalQ)
      setCurrentQuestion(q)
    } catch (err) {
      console.warn('Study question generation failed:', err)
      setError('Could not generate question. Retrying...')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitAnswer({ answer, hintUsed }) {
    if (submitting) return
    setSubmitting(true)
    try {
      const fb = await evaluateStudyAnswer(studyConfig, currentQuestion.question, answer)
      let finalScore = fb.score
      if (hintUsed && finalScore > 1) finalScore -= 1

      const updatedFb = { ...fb, score: finalScore }

      setQuestions((prev) => [...prev, { question: currentQuestion.question, answer, ...updatedFb }])
      setScores((prev) => [...prev, { score: finalScore }])
      setCurrentFeedback(updatedFb)
    } catch (err) {
      console.warn('Answer evaluation failed:', err)
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
      const validScores = scores.length > 0 ? scores : [{ score: 7 }]
      setLastSessionScores(validScores)
      const avg = validScores.reduce((s, x) => s + (x.score || 7), 0) / validScores.length
      addSessionToHistory({
        mode: 'study',
        topic: `${studyConfig?.subject || 'Science'} - ${studyConfig?.topic || 'General'}`,
        board: studyConfig?.board || 'CBSE',
        grade: studyConfig?.grade || 'Class 10',
        date: new Date().toLocaleDateString(),
        score: `${Math.round(avg * 10)}%`,
        questionsCount: questions.length || 1
      })
      setScreen('study-summary')
    } else {
      setCurrentQ((prev) => prev + 1)
    }
  }

  if (!studyConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in">
        <div className="dot-pulse"><span /><span /><span /></div>
        <p className="text-xs text-purple-300 font-medium">Redirecting to Study Setup...</p>
      </div>
    )
  }

  if (loading || submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in">
        <div className="dot-pulse"><span /><span /><span /></div>
        <p className="text-xs text-purple-300 font-medium">
          {submitting ? 'Evaluating & Scoring Your Answer...' : `Generating Study Question ${currentQ + 1} of ${totalQ}...`}
        </p>
      </div>
    )
  }

  if (currentFeedback) {
    return (
      <StudyFeedback
        feedback={currentFeedback}
        currentQ={currentQ}
        totalQ={totalQ}
        onNext={handleNextQuestion}
      />
    )
  }

  return (
    <StudyQuestion
      questionData={currentQuestion}
      currentQ={currentQ}
      totalQ={totalQ}
      onSubmit={handleSubmitAnswer}
      submitting={submitting}
    />
  )
}
