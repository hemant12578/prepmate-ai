import { PRESET_TOPICS } from '../data/presetQuestions'

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'openrouter/auto',
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
]

function getHeaders() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://prepmate-ai.web.app',
    'X-Title': 'PrepMate AI'
  }
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  return headers
}

async function callAI(prompt, attempt = 0) {
  const model = MODELS[Math.min(attempt, MODELS.length - 1)]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      })
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const errText = await res.text()
      if (attempt < MODELS.length - 1) {
        console.warn(`Model ${model} failed (${res.status}), trying next fallback model...`)
        return callAI(prompt, attempt + 1)
      }
      throw new Error(`API error ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      if (attempt < MODELS.length - 1) return callAI(prompt, attempt + 1)
      throw new Error('Empty response from AI model')
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
      console.warn('Unparseable AI response:', content)
      throw new Error('Could not parse AI response as JSON')
    }
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      if (attempt < MODELS.length - 1) return callAI(prompt, attempt + 1)
      throw new Error('AI Request timed out')
    }
    throw err
  }
}

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
    const result = await callAI(prompt)
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
    console.warn('AI call failed, utilizing preset topic fallback:', err)
    const normalized = topic.toLowerCase().trim()
    const preset = PRESET_TOPICS.find(p => normalized.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(normalized))
    if (preset && preset.questions.length > 0) {
      const idx = (questionNum - 1) % preset.questions.length
      const item = preset.questions[idx]
      return {
        question: item.question,
        format: item.options ? 'mcq' : 'subjective',
        options: item.options || null,
        correctAnswer: item.correctAnswer || null,
        difficulty: item.difficulty || difficulty,
        hint: item.hint || '',
        type: preset.type || interviewType
      }
    }
    throw err
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

  const result = await callAI(prompt)
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

  const result = await callAI(prompt)
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
