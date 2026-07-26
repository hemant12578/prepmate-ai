import { callAI, parseJSON } from './ai'


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
    const response = await callAI(prompt, { maxTokens: 1500, timeout: 35000 })
    return parseJSON(response)
  } catch (e) {
    console.error('Summary failed:', e.message)
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
    const response = await callAI(prompt, { maxTokens: 1500, timeout: 35000 })
    const parsed = parseJSON(response)
    if (Array.isArray(parsed)) return parsed
    const arr = parsed.flashcards || parsed.cards || parsed.items || Object.values(parsed).find(v => Array.isArray(v))
    if (Array.isArray(arr)) return arr
    throw new Error('Response was not an array')
  } catch (e) {
    console.error('Flashcards failed:', e.message)
    throw new Error('Could not generate flashcards. Please check your internet connection and try again.')
  }
}

export async function chatWithDocument(docText, historyMessages, userMessage) {
  const textSample = (docText || '').slice(0, 6000)
  const systemPrompt = `You are an expert AI study tutor. Answer the student's question based on the provided document notes. Be helpful, clear, and educational. If the answer isn't directly in the document, provide the best relevant explanation.`

  const recentHistory = (historyMessages || []).slice(-6)
  let historyContext = ''
  if (recentHistory.length > 1) {
    historyContext = '\n\nConversation History:\n' + recentHistory.map(m => 
      `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`
    ).join('\n') + '\n'
  }

  const prompt = `Document Context:\n${textSample}${historyContext}\n\nStudent Question: ${userMessage}\n\nProvide a clear, helpful answer:`
  
  try {
    const res = await callAI(prompt, { system: systemPrompt, maxTokens: 1500, timeout: 35000 })
    if (res) return res
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
    const script = await callAI(prompt, { maxTokens: 1500, timeout: 35000 })
    if (script && script.length > 50) return script
    throw new Error('Script too short')
  } catch (e) {
    console.error('Audio script generation failed:', e.message)
    throw new Error('Could not generate audio script. Please check your internet connection and try again.')
  }
}
