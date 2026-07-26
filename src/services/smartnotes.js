const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'openrouter/auto',
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-7b-instruct:free',
]

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://prepmate-ai.web.app',
    'X-Title': 'PrepMate AI Smart Notes'
  }
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (key) headers['Authorization'] = `Bearer ${key}`
  return headers
}

async function callAI(prompt, systemPrompt = '', attempt = 0) {
  const model = MODELS[Math.min(attempt, MODELS.length - 1)]
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 35000)

  // Combine system instructions into user prompt for maximum free model compatibility
  let fullContent = prompt
  if (systemPrompt) {
    fullContent = `${systemPrompt}\n\nTask / Question:\n${prompt}`
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: fullContent }],
        temperature: 0.7,
        max_tokens: 1500,
      })
    })

    clearTimeout(timeout)

    if (!res.ok) {
      if (attempt < MODELS.length - 1) {
        console.warn(`SmartNotes AI model ${model} failed (${res.status}), trying next...`)
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
  if (!text) throw new Error('Empty text')
  let cleaned = text.trim()

  // Remove markdown code fences if present
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
  }

  try {
    return JSON.parse(cleaned)
  } catch (e) {
    // Regex extract first array or object
    const match = cleaned.match(/[\{\[\s\S]*[\}\]]/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch (err) {
        console.warn('Regex JSON extraction failed:', match[0])
      }
    }
    throw new Error('Could not parse AI JSON response')
  }
}

export async function generateDocSummary(docText) {
  const textSample = docText.slice(0, 8000)
  const prompt = `You are a study assistant. Analyze this document and return ONLY a JSON object:
{
  "title": "infer a short title from the content",
  "oneLiner": "one sentence summary",
  "keyPoints": ["6-8 most important points"],
  "mainConcepts": ["Term: definition"],
  "studyGuide": "3-4 paragraph structured study guide based on this content",
  "difficulty": "Intermediate"
}

Document content:
${textSample}`

  try {
    const response = await callAI(prompt)
    return parseJSONResponse(response)
  } catch (e) {
    console.error('Summary generation failed:', e.message)
    throw new Error('Could not generate summary. Please check your internet connection and try again.')
  }
}

export async function generateFlashcards(docText) {
  const textSample = docText.slice(0, 8000)
  const prompt = `You are a study coach. Create flashcards from this document.
Return ONLY a JSON array of 10 flashcard objects:
[
  { "front": "question or term", "back": "answer or definition", "category": "topic area" }
]

Document content:
${textSample}`

  try {
    const response = await callAI(prompt)
    const parsed = parseJSONResponse(response)
    if (Array.isArray(parsed)) return parsed
    if (parsed && typeof parsed === 'object') {
      const arr = parsed.flashcards || parsed.cards || parsed.items || Object.values(parsed).find(v => Array.isArray(v))
      if (Array.isArray(arr)) return arr
    }
    throw new Error('Response was not an array')
  } catch (e) {
    console.error('Flashcard generation failed:', e.message)
    throw new Error('Could not generate flashcards. Please check your internet connection and try again.')
  }
}

export async function chatWithDocument(docText, historyMessages, userMessage) {
  const textSample = (docText || '').slice(0, 6000)
  const systemPrompt = `You are an expert AI study tutor. Answer the student's question based on the provided document notes. Be helpful, clear, and educational. If the answer isn't directly in the document, provide the best relevant explanation.`

  // Build conversation context from history (last 6 messages for context window)
  const recentHistory = (historyMessages || []).slice(-6)
  let historyContext = ''
  if (recentHistory.length > 1) {
    historyContext = '\n\nConversation History:\n' + recentHistory.map(m => 
      `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`
    ).join('\n') + '\n'
  }

  const prompt = `Document Context:\n${textSample}${historyContext}\n\nStudent Question: ${userMessage}\n\nProvide a clear, helpful answer:`
  
  try {
    const res = await callAI(prompt, systemPrompt)
    if (res && res.length > 5) return res
    throw new Error('Empty AI response')
  } catch (e) {
    console.error('Chat failed:', e.message)
    throw new Error('AI is currently unavailable. Please try again in a moment.')
  }
}

export async function generateAudioScript(docText) {
  const textSample = docText.slice(0, 8000)
  const prompt = `You are a podcast host creating an educational audio overview.
Write a 2 minute spoken script (about 300 words) explaining this document as if you're talking to a student.
Start with 'Hey! Welcome to your PrepMate AI audio overview...'
Include: what the topic is, key insights, and an encouraging closing line.
Return ONLY plain spoken text script.`

  try {
    const script = await callAI(prompt)
    if (script && script.length > 50) return script
    throw new Error('Script too short')
  } catch (e) {
    console.error('Audio script generation failed:', e.message)
    throw new Error('Could not generate audio script. Please check your internet connection and try again.')
  }
}
