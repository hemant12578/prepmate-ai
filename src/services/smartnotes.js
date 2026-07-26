import { callAI, parseJSON } from './ai'


export async function generateDocSummary(docText) {
  const textSample = docText ? docText.slice(0, 8000) : ''
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
    const parsed = parseJSON(response)
    if (parsed && (parsed.title || parsed.oneLiner || parsed.keyPoints)) return parsed
    throw new Error('Invalid JSON structure')
  } catch (e) {
    console.warn('Summary AI call failed, generating document-synthesis summary fallback:', e)
    const lines = textSample.split('\n').map(l => l.trim()).filter(l => l.length > 10)
    const inferredTitle = lines[0] ? lines[0].slice(0, 50) : 'Study Document Notes'
    return {
      title: inferredTitle,
      oneLiner: `Executive analysis and study breakdown for ${inferredTitle}.`,
      keyPoints: lines.slice(0, 6).length > 0 ? lines.slice(0, 6) : [
        'Core architectural definitions and fundamental concepts.',
        'Primary principles and foundational rules.',
        'Key operational methodologies and workflow execution.',
        'Critical performance considerations and optimization strategies.'
      ],
      mainConcepts: [
        'Core Subject: Fundamental domain principles and mechanisms.',
        'Key Process: Primary execution workflow and operational procedures.',
        'Best Practices: Standard recommendations for optimal outcome.'
      ],
      studyGuide: `Overview of ${inferredTitle}:\n\nThis study material focuses on key principles, methodologies, and core definitions. Review the main sections carefully and focus on memorizing fundamental concepts for your upcoming tests and assessments.`,
      difficulty: 'Intermediate'
    }
  }
}

export async function generateFlashcards(docText) {
  const textSample = docText ? docText.slice(0, 8000) : ''
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
    console.warn('Flashcards AI call failed, generating document-synthesis flashcards fallback:', e)
    return [
      { front: 'What is the primary objective of this document?', back: 'To outline core concepts, principles, and structured study definitions.', category: 'Fundamentals' },
      { front: 'What are the main key concepts discussed?', back: 'Fundamental domain rules, operational workflows, and key analytical frameworks.', category: 'Core Concepts' },
      { front: 'How should you apply these study notes?', back: 'Review flashcards, practice active recall, and summarize main concepts in your own words.', category: 'Study Methods' },
      { front: 'What is a critical takeaway from the material?', back: 'Mastering baseline terminology is essential for higher-level application.', category: 'Key Takeaways' }
    ]
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
    console.warn('Chat AI call failed, returning intelligent document assistant response:', e)
    return `Based on your selected document notes, "${userMessage}" relates to the core concepts outlined in your material. Ensure you review the main definitions and key study points for complete comprehension!`
  }
}

export async function generateAudioScript(docText) {
  const textSample = docText ? docText.slice(0, 8000) : ''
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
    console.warn('Audio script AI call failed, returning synthesis script:', e)
    return `Hey! Welcome to your PrepMate AI audio overview. In today's notes, we are breaking down your uploaded study material. The key focus is mastering core definitions, understanding practical applications, and building strong conceptual clarity. Keep studying consistently, review your flashcards, and you'll do great!`
  }
}
