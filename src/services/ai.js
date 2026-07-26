// src/services/ai.js
// Shared OpenRouter API client

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'openrouter/free',
  'inclusionai/ling-3.0-flash:free',
  'poolside/laguna-s-2.1:free',
  'cohere/north-mini-code:free',
  'openrouter/auto',
]

function headers() {
  const h = {
    'Content-Type': 'application/json',
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://prepmate-ai.web.app',
    'X-Title': 'PrepMate AI'
  }
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (key) h['Authorization'] = `Bearer ${key}`
  return h
}

async function callPollinationsAI(prompt, systemPrompt = '') {
  let content = prompt
  if (systemPrompt) content = `${systemPrompt}\n\n${prompt}`

  const res = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content }]
    })
  })
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`)
  const text = await res.text()
  if (!text || text.length < 5) throw new Error('Pollinations empty response')
  return text.trim()
}

/**
 * Call OpenRouter with automatic model fallback & Pollinations backup.
 * @param {string} prompt - User prompt
 * @param {Object} opts - Options
 * @param {string} opts.system - System prompt (merged into user prompt for free model compat)
 * @param {number} opts.maxTokens - Max tokens (default 1024)
 * @param {number} opts.timeout - Timeout in ms (default 30000)
 * @returns {string} Raw AI response text
 */
export async function callAI(prompt, { system = '', maxTokens = 1024, timeout = 7000 } = {}, attempt = 0) {
  const model = MODELS[Math.min(attempt, MODELS.length - 1)]
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  let content = prompt
  if (system) content = `${system}\n\n${prompt}`

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: headers(),
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content }],
        temperature: 0.7,
        max_tokens: maxTokens,
      })
    })
    clearTimeout(timer)

    if (!res.ok) {
      if (attempt < MODELS.length - 1) return callAI(prompt, { system, maxTokens, timeout }, attempt + 1)
      return callPollinationsAI(prompt, system)
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content
    if (!text) {
      if (attempt < MODELS.length - 1) return callAI(prompt, { system, maxTokens, timeout }, attempt + 1)
      return callPollinationsAI(prompt, system)
    }
    return text.trim()
  } catch (err) {
    clearTimeout(timer)
    if (attempt < MODELS.length - 1) return callAI(prompt, { system, maxTokens, timeout }, attempt + 1)
    try {
      return await callPollinationsAI(prompt, system)
    } catch {
      throw err
    }
  }
}

/**
 * Call AI and parse response as JSON.
 * Handles markdown fences and partial JSON extraction.
 */
export async function callAIJSON(prompt, opts = {}) {
  const raw = await callAI(prompt, opts)
  return parseJSON(raw)
}

export function parseJSON(text) {
  if (!text) throw new Error('Empty response')
  let s = text.trim()

  // Strip markdown fences
  if (s.includes('```')) {
    s = s.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
  }

  try { return JSON.parse(s) } catch {}

  // Try extracting first JSON object or array
  const m = s.match(/[\{\[][\s\S]*[\}\]]/)
  if (m) {
    try { return JSON.parse(m[0]) } catch {}
  }

  throw new Error('Failed to parse AI response')
}
