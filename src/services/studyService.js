import { callAIJSON } from './ai'

export async function generateStudyQuestion(config, questionNum, totalNum) {
  const { board = 'CBSE', grade = 'Class 10', subject = 'Science', topic = 'General', format = 'mixed', difficulty = 'Medium', pyqMode, isExamMode, uploadedDocText, ncertSyllabusContext } = config || {}

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

  const pyqInstruction = pyqMode || isExamMode
    ? 'Format this question strictly in the style of previous year board examination questions.'
    : ''

  const formatInstruction = effectiveFormat === 'mcq'
    ? 'Provide 4 options: A, B, C, D and explicitly mention options in the JSON array: ["A) ...", "B) ...", "C) ...", "D) ..."].'
    : effectiveFormat === 'true_false'
    ? 'Provide a True or False question.'
    : 'Provide a conceptual short answer question.'

  const prompt = `You are an expert study coach for ${board} ${grade}.
Generate 1 study question for:
Subject: ${subject}
Topic/Chapter: ${topic}
Format: ${effectiveFormat} (${formatInstruction})
Difficulty: ${difficulty}
Question ${questionNum} of ${totalNum}.
${pyqInstruction}
${contextBlock}

Return ONLY a JSON object in this exact format:
{
  "question": "question text here",
  "format": "${effectiveFormat}",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "hint": "a helpful 1-sentence hint"
}`

  try {
    const result = await callAIJSON(prompt, { maxTokens: 512, timeout: 25000 })
    let processedOptions = null
    if (Array.isArray(result.options)) {
      processedOptions = result.options.map(opt => typeof opt === 'string' ? opt : JSON.stringify(opt))
    } else if (typeof result.options === 'object' && result.options !== null) {
      processedOptions = Object.entries(result.options).map(([k, v]) => `${k}) ${v}`)
    }

    if (effectiveFormat === 'mcq' && (!processedOptions || processedOptions.length < 2)) {
      processedOptions = [
        `A) Primary mechanism of ${topic}`,
        `B) Secondary process of ${topic}`,
        `C) Environmental external factor`,
        `D) All of the above`
      ]
    }

    return {
      question: result.question || `What is a key principle of ${topic} in ${subject}?`,
      format: effectiveFormat,
      options: effectiveFormat === 'mcq'
        ? (processedOptions && processedOptions.length >= 2
            ? processedOptions
            : [
                `A) Primary concept of ${topic}`,
                `B) Secondary mechanism of ${topic}`,
                `C) Auxiliary environmental factor`,
                `D) All of the above`
              ])
        : (effectiveFormat === 'true_false' ? ['True ✓', 'False ✗'] : null),
      hint: result.hint || 'Think about core textbook definitions.',
      difficulty: difficulty
    }
  } catch (e) {
    console.error('Study question generation failed:', e.message)
    throw new Error('Could not generate question. Please check your internet connection and try again.')
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
    const result = await callAIJSON(prompt, { maxTokens: 512, timeout: 25000 })
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
    console.error('Answer evaluation failed:', e.message)
    throw new Error('Could not evaluate your answer. Please try again.')
  }
}

export async function generateStudySummary(config, questionsAndScores) {
  const { topic = 'General Study', subject = 'Science' } = config || {}

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
    const res = await callAIJSON(prompt, { maxTokens: 512, timeout: 25000 })
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
