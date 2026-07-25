const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'openrouter/auto',
]

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://prepmate-ai.web.app',
    'X-Title': 'PrepMate AI Study'
  }
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (key) headers['Authorization'] = `Bearer ${key}`
  return headers
}

async function callAI(prompt, attempt = 0) {
  const model = MODELS[Math.min(attempt, MODELS.length - 1)]
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000) // Fast 6-second timeout per attempt

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 512, // Compact token output for maximum speed
      })
    })

    clearTimeout(timeout)

    if (!res.ok) {
      if (attempt < MODELS.length - 1) return callAI(prompt, attempt + 1)
      throw new Error(`API error ${res.status}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      if (attempt < MODELS.length - 1) return callAI(prompt, attempt + 1)
      throw new Error('Empty response from AI')
    }

    let cleaned = content.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    try {
      return JSON.parse(cleaned)
    } catch (e) {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) return JSON.parse(jsonMatch[0])
      throw new Error('Could not parse AI response as JSON')
    }
  } catch (err) {
    clearTimeout(timeout)
    if (attempt < MODELS.length - 1) return callAI(prompt, attempt + 1)
    throw err
  }
}

export async function generateStudyQuestion(config, questionNum, totalNum) {
  const { board = 'CBSE', grade = 'Class 10', subject = 'Science', topic = 'General', format = 'mixed', difficulty = 'Medium', pyqMode, isExamMode, uploadedDocText, ncertSyllabusContext } = config || {}

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

  const pyqInstruction = pyqMode || isExamMode
    ? 'Format this question strictly in the style of previous year board examination questions.'
    : ''

  const formatInstruction = format === 'mcq'
    ? 'Provide 4 options: A, B, C, D and explicitly mention options in the JSON.'
    : format === 'true_false'
    ? 'Provide a True or False question.'
    : format === 'subjective'
    ? 'Provide a conceptual short answer question.'
    : 'Choose the best format (MCQ, True/False, or Short Answer).'

  const prompt = `You are an expert study coach for ${board} ${grade}.
Generate 1 study question for:
Subject: ${subject}
Topic/Chapter: ${topic}
Format: ${format} (${formatInstruction})
Difficulty: ${difficulty}
Question ${questionNum} of ${totalNum}.
${pyqInstruction}
${contextBlock}

Return ONLY a JSON object in this exact format:
{
  "question": "question text here",
  "format": "${format}",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "hint": "a helpful 1-sentence hint"
}`

  try {
    const result = await callAI(prompt)
    return {
      question: result.question || `Explain the core concepts of ${topic}.`,
      format: result.format || format,
      options: Array.isArray(result.options) ? result.options : null,
      hint: result.hint || 'Think about the core definitions and formulas.',
      difficulty: difficulty
    }
  } catch (e) {
    // Fast fallback question
    return {
      question: `What are the fundamental principles and key definitions of ${topic} in ${subject}?`,
      format: 'subjective',
      options: null,
      hint: 'Recall the main formulas and textbook chapter definitions.',
      difficulty: difficulty
    }
  }
}

export async function evaluateStudyAnswer(config, question, userAnswer) {
  const { board = 'CBSE', grade = 'Class 10', subject = 'Science', topic = 'General' } = config || {}

  const prompt = `You are a friendly study coach evaluating a student's answer.
Board: ${board}, Grade: ${grade}, Subject: ${subject}, Topic: ${topic}
Question: ${question}
Student's Answer: ${userAnswer}

Return ONLY a JSON object:
{
  "score": 7,
  "whatYouGotRight": "specific positive aspect of their answer",
  "whatYouMissed": "key concept or detail missing",
  "conceptExplanation": "explain the concept simply in 2-3 sentences as a great teacher would",
  "memoryTrick": "one clever line memory trick or mnemonic to remember this forever",
  "studyThisNext": "related subtopic they should read next",
  "encouragement": "motivating 1-line feedback"
}

Score should be 1-10.`

  try {
    const result = await callAI(prompt)
    return {
      score: Math.min(10, Math.max(1, Number(result.score) || 7)),
      whatYouGotRight: result.whatYouGotRight || 'Good effort on addressing the question!',
      whatYouMissed: result.whatYouMissed || 'Try to include more specific textbook terminology.',
      conceptExplanation: result.conceptExplanation || `Review the core ${topic} chapter definitions.`,
      memoryTrick: result.memoryTrick || 'Remember: Practice active recall for long-term retention!',
      studyThisNext: result.studyThisNext || `Review ${topic} formulas and key diagrams.`,
      encouragement: result.encouragement || 'Great job! Keep up the solid effort.'
    }
  } catch (e) {
    // Instant fallback evaluation when network is slow
    const wordCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0
    const heuristicScore = Math.min(10, Math.max(5, Math.round(wordCount * 0.8) + 4))
    return {
      score: heuristicScore,
      whatYouGotRight: 'Demonstrated good understanding of the primary concept.',
      whatYouMissed: 'Could expand with additional specific examples and definitions.',
      conceptExplanation: `Mastering ${topic} requires connecting basic definitions with real-world applications.`,
      memoryTrick: 'Key Rule: Summarize main concepts in 3 concise bullet points.',
      studyThisNext: `Next subtopic in ${subject}.`,
      encouragement: 'Solid attempt! Continuous practice leads to mastery.'
    }
  }
}

export async function generateStudySummary(config, questionsAndScores) {
  const { topic = 'General Study', subject = 'Science' } = config || {}

  // Fail-safe score extraction — NEVER returns NaN
  const safeScores = Array.isArray(questionsAndScores) && questionsAndScores.length > 0
    ? questionsAndScores
    : [{ score: 7 }]

  const sum = safeScores.reduce((s, q) => s + (Number(q?.score || q?.overallScore) || 7), 0)
  const avg = sum / safeScores.length
  const totalScore = Math.round(avg * 10)

  const prompt = `You are a study coach. Analyze these session results:
Topic: ${topic}, Subject: ${subject}
Results: ${JSON.stringify(safeScores)}

Return ONLY JSON:
{
  "strongestTopic": "subtopic where user performed best",
  "weakestTopic": "subtopic needing review",
  "recommendedNext": "next recommended chapter/topic to study",
  "badge": "${totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : 'Keep Practicing'}",
  "motivationalMsg": "1-sentence encouraging summary"
}`

  try {
    const res = await callAI(prompt)
    return {
      totalScore: isNaN(totalScore) ? 75 : totalScore,
      averageScore: isNaN(avg) ? 7.5 : Math.round(avg * 10) / 10,
      performanceBadge: res?.badge || (totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : 'Keep Practicing'),
      strongestTopic: res?.strongestTopic || topic,
      weakestTopic: res?.weakestTopic || 'Key definitions & formulas',
      recommendedNext: res?.recommendedNext || `Advanced ${topic} Practice`,
      motivationalMsg: res?.motivationalMsg || 'Great session! Consistency is key to mastering your board exams.'
    }
  } catch (e) {
    return {
      totalScore: isNaN(totalScore) ? 75 : totalScore,
      averageScore: isNaN(avg) ? 7.5 : Math.round(avg * 10) / 10,
      performanceBadge: totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : 'Keep Practicing',
      strongestTopic: topic,
      weakestTopic: 'Core definitions & terms',
      recommendedNext: `Advanced ${topic} Practice`,
      motivationalMsg: 'Great job completing your study session!'
    }
  }
}
