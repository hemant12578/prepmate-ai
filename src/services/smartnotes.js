const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'openrouter/free',
  'openrouter/auto',
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
]

function getHeaders() {
  return {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'PrepMate AI Smart Notes'
  }
}

async function callAI(prompt, systemPrompt = '', attempt = 0) {
  const model = MODELS[Math.min(attempt, MODELS.length - 1)]
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 35000)

  const messages = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: prompt })

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      })
    })

    clearTimeout(timeout)

    if (!res.ok) {
      if (attempt < MODELS.length - 1) {
        console.warn(`SmartNotes AI model ${model} failed, trying next...`)
        return callAI(prompt, systemPrompt, attempt + 1)
      }
      throw new Error(`API Error ${res.status}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      if (attempt < MODELS.length - 1) return callAI(prompt, systemPrompt, attempt + 1)
      throw new Error('Empty AI response')
    }

    return content.trim()
  } catch (err) {
    clearTimeout(timeout)
    if (attempt < MODELS.length - 1) return callAI(prompt, systemPrompt, attempt + 1)
    throw err
  }
}

function parseJSONResponse(text) {
  let cleaned = text.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }
  try {
    return JSON.parse(cleaned)
  } catch (e) {
    const match = cleaned.match(/[\{\[\s\S]*[\}\]]/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI JSON response')
  }
}

export async function generateDocSummary(docText) {
  const textSample = docText.slice(0, 8000)
  const prompt = `You are a study assistant. Analyze this document and return ONLY a JSON object:
{
  "title": "infer a title from the content",
  "oneLiner": "one sentence summary",
  "keyPoints": ["6-8 most important points"],
  "mainConcepts": ["Term: definition"],
  "studyGuide": "3-4 paragraph structured study guide based on this content",
  "difficulty": "Beginner"
}

Document content: ${textSample}`

  const response = await callAI(prompt)
  return parseJSONResponse(response)
}

export async function generateFlashcards(docText) {
  const textSample = docText.slice(0, 8000)
  const prompt = `You are a study coach. Create flashcards from this document.
Return ONLY a JSON array of 10-12 flashcard objects:
[
  { "front": "question or term", "back": "answer or definition", "category": "topic area" }
]
Make questions that test real understanding, not just memorization.
Document: ${textSample}`

  const response = await callAI(prompt)
  const cards = parseJSONResponse(response)
  return Array.isArray(cards) ? cards : []
}

export async function chatWithDocument(docText, historyMessages, userMessage) {
  const textSample = docText.slice(0, 8000)
  const systemPrompt = `You are a helpful study assistant. Answer questions ONLY based on the provided document. If the answer is not in the document, say "I could not find that in your notes." Be concise and clear.
Document content: ${textSample}`

  const prompt = userMessage
  // Send chat request
  return callAI(prompt, systemPrompt)
}

export async function generateAudioScript(docText) {
  const textSample = docText.slice(0, 8000)
  const prompt = `You are a podcast host creating an educational audio overview.
Write a 2-3 minute spoken script (about 350-450 words) explaining this document as if you're talking to a student.
Make it conversational, engaging, not robotic.
Start with 'Hey, welcome to your PrepMate audio overview...'
Include: what the topic is, the 3-4 most important things to know, and end with a motivational closing line.
Return ONLY the script as plain text, no JSON, no formatting marks.`

  return callAI(prompt)
}
