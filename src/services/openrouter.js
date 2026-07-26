import { callAIJSON } from './ai'
export async function generateQuestion(topic, mode, difficulty, questionNum, interviewType = 'Mixed', prevScores = [], format = 'mixed', optionsObj = {}) {
  const { uploadedDocText = '', ncertSyllabusContext = '', isExamMode = false } = typeof optionsObj === 'object' ? optionsObj : {}

  let prompt = ''
  const scoreTrend = prevScores.length > 1
    ? (prevScores[prevScores.length - 1] > prevScores[prevScores.length - 2] ? 'improving' : 'declining')
    : 'stable'

  const effectiveFormat = format === 'mixed'
    ? (questionNum % 2 === 1 ? 'mcq' : 'subjective')
    : format

  let contextBlock = ''
  if (uploadedDocText) {
    contextBlock += `\nRefer directly to this uploaded document / PYQ paper content to formulate the question:\n"${uploadedDocText.slice(0, 1500)}"\n`
  }
  if (ncertSyllabusContext) {
    contextBlock += `\nAlign strict learning standards with this official NCERT Syllabus context:\n"${ncertSyllabusContext}"\n`
  }
  if (isExamMode) {
    contextBlock += `\nMode: Official Exam Mode. Ensure questions match formal board exam / PYQ paper patterns and test core conceptual knowledge.\n`
  }

  if (effectiveFormat === 'mcq') {
    prompt = `You are an educational AI. Generate 1 Multiple Choice Question (MCQ) on topic/role: "${topic}".
Difficulty: ${difficulty}. Question ${questionNum} of 5.${contextBlock}

Return ONLY a JSON object in this exact format, no other text:
{
  "question": "your question here?",
  "format": "mcq",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "correctAnswer": "A",
  "difficulty": "${difficulty}",
  "hint": "a helpful hint"
}`
  } else if (effectiveFormat === 'true_false') {
    prompt = `You are an educational AI. Generate 1 True/False Question on topic/role: "${topic}".
Difficulty: ${difficulty}. Question ${questionNum} of 5.${contextBlock}

Return ONLY a JSON object in this exact format, no other text:
{
  "question": "statement here",
  "format": "true_false",
  "options": ["True", "False"],
  "correctAnswer": "True",
  "difficulty": "${difficulty}",
  "hint": "a helpful hint"
}`
  } else {
    if (mode === 'study') {
      prompt = `You are a study coach. Generate 1 practice question on topic: "${topic}".
Difficulty: ${difficulty}. Question ${questionNum} of 5. Score trend: ${scoreTrend}.${contextBlock}

Return ONLY a JSON object in this exact format, no other text:
{"question": "your question here", "format": "subjective", "difficulty": "${difficulty}", "hint": "a brief hint"}`
    } else {
      prompt = `You are an interview coach. Generate 1 ${interviewType} interview question for role: "${topic}".
Difficulty: ${difficulty}. Question ${questionNum} of 5. Score trend: ${scoreTrend}.${contextBlock}

Return ONLY a JSON object in this exact format, no other text:
{"question": "your question here", "format": "subjective", "difficulty": "${difficulty}", "type": "${interviewType}"}`
    }
  }

  try {
    const result = await callAIJSON(prompt)
    return {
      question: result.question || 'Could not generate question',
      format: result.format || effectiveFormat,
      options: Array.isArray(result.options) ? result.options : null,
      correctAnswer: result.correctAnswer || null,
      difficulty: result.difficulty || difficulty,
      hint: result.hint || '',
      type: result.type || interviewType,
    }
  } catch (err) {
    console.error('AI question generation failed:', err.message)
    throw new Error('Could not generate question. Please check your internet connection and try again.')
  }
}

export async function evaluateAnswer(topic, mode, question, userAnswer) {
  const prompt = `You are an expert evaluator. Evaluate this answer:

Topic/Role: ${topic}
Question: ${question}
User's Answer: ${userAnswer}

Return ONLY a JSON object in this exact format, no other text:
{"score": 7, "whatYouGotRight": "what the user got right", "whatYouMissed": "what the user missed or could improve", "idealAnswer": "the ideal complete answer", "encouragement": "a short encouraging message"}

Score should be 1-10. Be encouraging but honest. If the answer is empty or nonsensical, give a low score.`

  const result = await callAIJSON(prompt)
  return {
    score: Math.min(10, Math.max(1, Number(result.score) || 5)),
    whatYouGotRight: result.whatYouGotRight || 'Good attempt!',
    whatYouMissed: result.whatYouMissed || 'Try to be more specific next time.',
    idealAnswer: result.idealAnswer || 'No ideal answer available.',
    encouragement: result.encouragement || 'Keep going!',
  }
}

export async function generateSummary(topic, mode, questionsAndScores) {
  const prompt = `You are a learning coach. Based on these results, give a final summary:

Topic/Role: ${topic}
Mode: ${mode}
Questions and scores: ${JSON.stringify(questionsAndScores)}

Return ONLY a JSON object in this exact format, no other text:
{"totalScore": "3/5", "averageScore": 6.5, "performanceBadge": "Good", "strengths": ["strength1", "strength2"], "gaps": ["gap1", "gap2"], "suggestedResources": ["resource1", "resource2", "resource3"], "motivationalMessage": "encouraging message here"}

Performance badges: "Excellent" if avg >= 8, "Good" if avg >= 5, "Keep Practicing" if avg < 5.`

  const result = await callAIJSON(prompt)
  const avg = result.averageScore || (questionsAndScores.reduce((sum, q) => sum + q.score, 0) / questionsAndScores.length)
  const passed = questionsAndScores.filter(q => q.score >= 5).length

  return {
    totalScore: result.totalScore || `${passed}/${questionsAndScores.length}`,
    averageScore: Math.round(avg * 10) / 10,
    performanceBadge: result.performanceBadge || (avg >= 8 ? 'Excellent' : avg >= 5 ? 'Good' : 'Keep Practicing'),
    strengths: result.strengths || ['Completed all questions'],
    gaps: result.gaps || ['Review the material again'],
    suggestedResources: result.suggestedResources || ['Practice more on this topic'],
    motivationalMessage: result.motivationalMessage || 'Great effort! Keep learning and improving.',
  }
}
