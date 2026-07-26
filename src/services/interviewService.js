import { callAIJSON } from './ai'

export async function generateInterviewQuestion(config, questionNum, totalNum) {
  const { category = 'job', school = {}, college = {}, job = {}, pressureMode = 'Normal' } = config || {}

  let contextStr = ''
  if (category === 'school') {
    contextStr = `School Viva for ${school?.board || 'CBSE'} ${school?.grade || 'Class 10'}, Subject: ${school?.subject || 'Science'}, Topic: ${school?.topic || 'General'}, Style: ${school?.vivaStyle || 'Oral Viva'}`
  } else if (category === 'college') {
    contextStr = `College Entrance Interview for ${college?.targetType || 'University'}, Round: ${college?.round || 'Personal Interview'}, Focus: ${college?.focusArea || 'Academic'}`
  } else {
    contextStr = `Job Interview for ${job?.role || 'Software Engineer'} (${job?.expLevel || 'Entry Level'}), Round: ${job?.round || 'Technical'}, Company: ${job?.companyType || 'Product'}`
  }

  const prompt = `You are a professional interviewer simulating a real interview.
Interview Context: ${contextStr}
Question ${questionNum} of ${totalNum}.
Pressure Mode: ${pressureMode}

Generate 1 realistic interview question.
Return ONLY JSON:
{
  "question": "your interview question text",
  "isHrQuestion": boolean,
  "options": null
}`

  try {
    const result = await callAIJSON(prompt, { timeout: 25000 })
    return {
      question: result?.question || `Tell me about your experience and key technical challenges in ${category === 'job' ? (job?.role || 'this role') : (school?.subject || 'this subject')}.`,
      isHrQuestion: !!result?.isHrQuestion || (category === 'job' && job?.round === 'HR'),
      options: null
    }
  } catch (e) {
    console.warn('Interview question AI call failed, utilizing tailored fallback:', e)
    const fallbackTopic = category === 'job' ? (job?.role || 'Software Engineering') : category === 'school' ? (school?.subject || 'Science') : (college?.targetType || 'Academic Background')
    const sampleQuestions = [
      `Could you walk me through a complex technical challenge or project involving ${fallbackTopic} and how you resolved it?`,
      `What are the core design principles and trade-offs you prioritize when working on ${fallbackTopic}?`,
      `How do you handle unexpected system edge cases or production failures in ${fallbackTopic}?`,
      `Explain the fundamental architecture and key concepts behind ${fallbackTopic} to a non-technical stakeholder.`
    ]
    const selectedQ = sampleQuestions[(questionNum - 1) % sampleQuestions.length]
    return {
      question: selectedQ,
      isHrQuestion: category === 'job' && job?.round === 'HR',
      options: null
    }
  }
}

export async function evaluateInterviewAnswer(config, question, userAnswer, isHrQuestion = false) {
  const { category, job, pressureMode } = config

  const prompt = `You are a strict but fair corporate interviewer evaluating a candidate's answer.
Category: ${category}
Question: ${question}
Candidate's Answer: ${userAnswer}
Is HR Behavioral Question: ${isHrQuestion}
Pressure Mode: ${pressureMode}

Return ONLY JSON:
{
  "overallScore": number (1-10),
  "contentAccuracy": number (1-10),
  "communication": number (1-10),
  "structureClarity": number (1-10),
  "whatImpressed": "string (what impressed the interviewer)",
  "whatWeakened": "string (what weakened the answer)",
  "idealAnswerStructure": "string (how a top candidate would answer this)",
  "interviewTip": "string (actionable interview tip)",
  "starCheck": ${isHrQuestion ? '{"situation": true, "task": true, "action": false, "result": false}' : 'null'},
  "verdictLine": "string (1-sentence interviewer verbal feedback)"
}`

  try {
    const result = await callAIJSON(prompt, { timeout: 25000 })
    return {
      overallScore: Math.min(10, Math.max(1, Number(result.overallScore) || 6)),
      contentAccuracy: Math.min(10, Math.max(1, Number(result.contentAccuracy) || 7)),
      communication: Math.min(10, Math.max(1, Number(result.communication) || 7)),
      structureClarity: Math.min(10, Math.max(1, Number(result.structureClarity) || 6)),
      whatImpressed: result.whatImpressed || 'Clear communication and good confidence.',
      whatWeakened: result.whatWeakened || 'Could provide more specific concrete examples.',
      idealAnswerStructure: result.idealAnswerStructure || 'Start with a direct high-level summary, follow with 2 key supporting details, and conclude with the outcome.',
      interviewTip: result.interviewTip || 'Use the STAR format (Situation, Task, Action, Result) for structured responses.',
      starCheck: result.starCheck || (isHrQuestion ? { situation: true, task: true, action: false, result: false } : null),
      verdictLine: result.verdictLine || 'Good start, but needs more structured depth.'
    }
  } catch (e) {
    const wordCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0
    const heuristicScore = Math.min(10, Math.max(5, Math.round(wordCount * 0.4) + 5))
    return {
      overallScore: heuristicScore,
      contentAccuracy: heuristicScore,
      communication: Math.min(10, heuristicScore + 1),
      structureClarity: Math.max(5, heuristicScore - 1),
      whatImpressed: 'Answer was submitted clearly with good initiative.',
      whatWeakened: 'Could expand further with specific STAR format metrics and examples.',
      idealAnswerStructure: 'Structure responses with: 1. Situation overview, 2. Key Action taken, 3. Measurable Result.',
      interviewTip: 'Always quantify your impact when answering interview questions.',
      starCheck: isHrQuestion ? { situation: true, task: true, action: true, result: false } : null,
      verdictLine: 'Clear communication. Practice active recall to deepen your answers.'
    }
  }
}

export async function generateInterviewSummary(config, questionsAndScores) {
  const avg = questionsAndScores.reduce((s, q) => s + (q.overallScore || q.score || 6), 0) / questionsAndScores.length
  const avgContent = questionsAndScores.reduce((s, q) => s + (q.contentAccuracy || 7), 0) / questionsAndScores.length
  const avgComm = questionsAndScores.reduce((s, q) => s + (q.communication || 7), 0) / questionsAndScores.length
  const avgStruct = questionsAndScores.reduce((s, q) => s + (q.structureClarity || 6), 0) / questionsAndScores.length
  const overallScore = Math.round(avg * 10)

  let hiringVerdict = 'Hire'
  if (overallScore >= 80) hiringVerdict = 'Strong Hire'
  else if (overallScore >= 65) hiringVerdict = 'Hire'
  else if (overallScore >= 50) hiringVerdict = 'Maybe'
  else hiringVerdict = 'Not Yet'

  const prompt = `You are a senior hiring manager. Summarize candidate interview results:
Config: ${JSON.stringify(config)}
Session Scores: ${JSON.stringify(questionsAndScores)}

Return ONLY JSON:
{
  "strengths": ["tag1", "tag2", "tag3"],
  "improvements": ["tag1", "tag2", "tag3"],
  "finalVerdict": "2-sentence executive hiring debrief verdict"
}`

  try {
    const res = await callAIJSON(prompt, { timeout: 25000 })
    return {
      overallScore,
      hiringVerdict,
      metrics: {
        content: Math.round(avgContent * 10),
        communication: Math.round(avgComm * 10),
        structure: Math.round(avgStruct * 10),
        confidence: Math.round(((avgComm + avgStruct) / 2) * 10)
      },
      strengths: Array.isArray(res.strengths) ? res.strengths : ['Technical knowledge', 'Communication', 'Composure'],
      improvements: Array.isArray(res.improvements) ? res.improvements : ['Structure answers with STAR', 'Elaborate on results', 'Be concise'],
      finalVerdict: res.finalVerdict || `Candidate demonstrated good potential. With more structured answers and specific metrics, they will perform strongly in live interviews.`
    }
  } catch (e) {
    return {
      overallScore,
      hiringVerdict,
      metrics: { content: 75, communication: 70, structure: 65, confidence: 70 },
      strengths: ['Domain Awareness', 'Communication Clarity', 'Confidence'],
      improvements: ['Structure with STAR method', 'Provide concrete results', 'Elaborate on technical trade-offs'],
      finalVerdict: 'Solid interview performance overall. Keep refining your structured answers.'
    }
  }
}
