const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'openrouter/auto',
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-7b-instruct:free',
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
    console.warn('generateDocSummary failed, using smart fallback:', e)
    const lines = textSample.split('\n').filter(l => l.trim().length > 20)
    return {
      _isFallback: true,
      title: 'Notes Executive Summary',
      oneLiner: lines[0] || 'Summary generated from uploaded document notes.',
      keyPoints: lines.slice(1, 7).map(l => l.trim()),
      mainConcepts: ['Key Term: Primary concept extracted from notes', 'Overview: Comprehensive breakdown of subject matter'],
      studyGuide: `Study Guide Summary:\n\n1. Overview: This document covers key concepts and practice material.\n2. Review Focus: Pay close attention to definitions, formulas, and structural relationships described in the notes.\n3. Next Steps: Test yourself using the Flashcards tab and Chat assistant.`,
      difficulty: 'Intermediate'
    }
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
    console.warn('generateFlashcards failed, using fallback cards:', e)
    const snippets = textSample.split(/\.\s+/).filter(s => s.trim().length > 30).slice(0, 6)
    return [
      { _isFallback: true, front: 'What is the main topic of this document?', back: textSample.slice(0, 150) + '...', category: 'Overview' },
      ...snippets.map((snip, i) => ({
        _isFallback: true,
        front: `Key Concept ${i + 1}`,
        back: snip.trim(),
        category: 'Concept Review'
      }))
    ]
  }
}

export async function chatWithDocument(docText, historyMessages, userMessage) {
  const textSample = (docText || '').slice(0, 8000)
  const systemPrompt = `You are an expert AI study tutor. Answer the student's question based strictly on the provided document notes. If the answer is not mentioned, provide the best relevant explanation from the document context.`

  const prompt = `Document Context:\n${textSample}\n\nStudent Question: ${userMessage}`
  
  try {
    const res = await callAI(prompt, systemPrompt)
    if (res && res.length > 5) return res
    throw new Error('Empty AI response')
  } catch (e) {
    console.warn('chatWithDocument AI call failed, using intelligent doc extraction fallback:', e)
    const cleanText = textSample.trim()
    const qLower = (userMessage || '').toLowerCase()

    if (qLower.includes('summary') || qLower.includes('main idea')) {
      return `Based on your uploaded notes, here is the core summary:\n\n${cleanText.slice(0, 450)}...`
    }
    if (qLower.includes('question') || qLower.includes('practice')) {
      return `Here are key review questions generated from your document:\n\n1. What are the key concepts and principles outlined in this material?\n2. How do the foundational ideas connect to practical applications?\n3. What critical formulas or definitions should be memorized?`
    }
    if (qLower.includes('concept') || qLower.includes('hardest') || qLower.includes('explain')) {
      return `Key concept analysis from your document:\n\n"${cleanText.slice(0, 400)}..."\n\nFocus on understanding the relationships between these core ideas for exam preparation.`
    }

    // Keyword matching fallback
    const keywords = qLower.split(/\s+/).filter(w => w.length > 3)
    const matchingSentences = cleanText.split(/\.\s+/).filter(sentence => 
      keywords.some(kw => sentence.toLowerCase().includes(kw))
    )

    if (matchingSentences.length > 0) {
      return `Here is the relevant excerpt from your notes:\n\n"${matchingSentences.slice(0, 3).join('. ')}."`
    }

    return `Based on your document notes:\n\n"${cleanText.slice(0, 380)}..."\n\n(Tip: Feel free to ask specific questions about definitions, terms, or sections in your notes!)`
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
    console.warn('generateAudioScript fallback:', e)
    return `Hey! Welcome to your PrepMate AI audio overview. Today we are reviewing your uploaded study notes. The key takeaway from your material is: ${textSample.slice(0, 400)}... Make sure to review the flashcards and practice questions to master this topic. Keep up the great work!`
  }
}
