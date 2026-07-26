# PrepMate AI — Technical Documentation

> Version 1.0.0 · Last Updated: July 26, 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Application Architecture](#2-application-architecture)
3. [Routing & Navigation](#3-routing--navigation)
4. [State Management](#4-state-management)
5. [AI Service Layer](#5-ai-service-layer)
6. [Study Mode — Technical Reference](#6-study-mode--technical-reference)
7. [Interview Mode — Technical Reference](#7-interview-mode--technical-reference)
8. [Smart Notes — Technical Reference](#8-smart-notes--technical-reference)
9. [Authentication System](#9-authentication-system)
10. [Payment Integration](#10-payment-integration)
11. [Custom Hooks Reference](#11-custom-hooks-reference)
12. [3D & Visual Components](#12-3d--visual-components)
13. [Data Layer](#13-data-layer)
14. [Error Handling Strategy](#14-error-handling-strategy)
15. [Performance Optimizations](#15-performance-optimizations)
16. [Deployment Guide](#16-deployment-guide)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. System Overview

PrepMate AI is a **single-page React application** (SPA) built with Vite, deployed as a static site on Vercel with two serverless edge functions for payment processing.

### Core Principles

| Principle | Implementation |
|-----------|---------------|
| **Client-first** | All AI calls, PDF parsing, OCR, and speech processing happen in the browser |
| **Graceful degradation** | Every AI call has a fallback chain (4 models) + static fallback content |
| **Zero backend** | No database server — all user data persists in `localStorage` |
| **Offline-capable setup** | Preset question banks allow demo mode without API keys |

### System Requirements

| Component | Minimum |
|-----------|---------|
| Browser | Chrome 90+, Firefox 88+, Safari 15+, Edge 90+ |
| Network | Required for AI features; offline for preset questions |
| WebGL | Required for 3D landing page (gracefully degrades) |
| Web Speech API | Chrome/Edge for voice input; all browsers for TTS |

---

## 2. Application Architecture

### Component Hierarchy

```
<React.StrictMode>
└── <AuthProvider>                     # Firebase auth state
    └── <AppProvider>                  # Global app state + routing
        └── <App />                    # Root router + navbar + mesh background
            ├── <CustomCursor />       # Animated cursor overlay
            ├── <Navbar />             # Top navigation bar
            ├── <PageErrorBoundary>    # Error boundary wrapper
            │   └── <ActiveScreen />   # Current route component
            └── <OnboardingModal />    # First-time user wizard
```

### Data Flow

```
User Action → Component State → Service Layer → OpenRouter API
                                                      │
                                                      ▼
UI Update ← Component State ← Parsed Response ← JSON Response
```

---

## 3. Routing & Navigation

PrepMate AI uses a **custom hash-based router** synced with the HTML5 History API, implemented in `AppContext.jsx`.

### Route Map

| Route Path | Component | Description |
|-----------|-----------|-------------|
| `/` | `LandingPage` | Marketing landing page (unauthenticated) |
| `/dashboard` | `Home` | Main dashboard (authenticated) |
| `/study-setup` | `StudySetup` | Study session configuration |
| `/study-session` | `StudySession` | Active study Q&A loop |
| `/study-summary` | `StudySummary` | Post-study performance summary |
| `/interview-setup` | `InterviewSetup` | Interview session configuration |
| `/interview-session` | `InterviewSession` | Active interview Q&A loop |
| `/interview-summary` | `InterviewSummary` | Post-interview performance summary |
| `/smart-notes` | `SmartNotes` | Smart Notes workspace |
| `/profile` | `OnboardingModal` | User profile editor |
| `/about` | `About` | About page with 3D stats |
| `/pricing` | `Pricing` | Subscription tiers |
| `/status` | `Production` | System status monitor |

### Navigation Implementation

```javascript
// Setting a route programmatically
const { setScreen } = useApp()
setScreen('study-setup')  // Updates state + pushes to history

// URL sync: AppContext listens to popstate events
useEffect(() => {
  const handlePop = () => {
    const path = window.location.pathname.replace('/', '') || 'landing'
    setScreen(path)
  }
  window.addEventListener('popstate', handlePop)
}, [])
```

---

## 4. State Management

### AppContext (Global State)

**File:** `src/context/AppContext.jsx`

The `AppProvider` wraps the entire application and provides:

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `screen` | `string` | `'landing'` | Active route/screen name |
| `mode` | `string` | `'study'` | `'study'` or `'interview'` |
| `topic` | `string` | `''` | Current session topic |
| `difficulty` | `string` | `'Medium'` | `'Easy'`, `'Medium'`, `'Hard'` |
| `questionFormat` | `string` | `'mixed'` | `'mcq'`, `'subjective'`, `'mixed'` |
| `interviewType` | `string` | `'technical'` | `'technical'`, `'hr'`, `'mixed'` |
| `studyConfig` | `object` | `{}` | Full study setup (board, grade, subject, chapter, etc.) |
| `interviewConfig` | `object` | `{}` | Full interview setup (role, company, experience, etc.) |
| `lastSessionScores` | `array` | `[]` | Score array for summary generation |
| `userProfile` | `object` | `null` | Saved user preferences |
| `history` | `array` | `[]` | Session history (max 100 entries) |

### Persistence Strategy

| Data | Storage | Key | Limits |
|------|---------|-----|--------|
| User Profile | `localStorage` | `prepmate_user_profile` | Single object |
| Session History | `localStorage` | `prepmate_history` | Capped at 100 entries |
| Smart Notes Sources | `localStorage` | `prepmate_smartnotes_sources` | Array of source objects |
| Onboarding Status | `localStorage` | `prepmate_onboarded` | Boolean flag |

---

## 5. AI Service Layer

### Service Files

| File | Mode | Functions |
|------|------|-----------|
| `openrouter.js` | Study | `generateQuestion()`, `evaluateAnswer()`, `generateSummary()` |
| `studyService.js` | Study | `generateStudyQuestion()`, `evaluateStudyAnswer()`, `generateStudySummary()` |
| `interviewService.js` | Interview | `generateInterviewQuestion()`, `evaluateInterviewAnswer()`, `generateInterviewSummary()` |
| `smartnotes.js` | Smart Notes | `generateDocSummary()`, `generateFlashcards()`, `chatWithDocument()`, `generateAudioScript()` |

### Model Fallback Chain

All services use a centralized AI client (`src/services/ai.js`) with a 5-tier strictly **100% Free ($0/M tokens)** OpenRouter fallback chain plus an automated Pollinations AI backup endpoint:

```
Attempt 0: openrouter/free                  (Strictly $0 free auto-router)
Attempt 1: inclusionai/ling-3.0-flash:free  (100% Free 124B MoE model)
Attempt 2: poolside/laguna-s-2.1:free       (100% Free 118B model)
Attempt 3: cohere/north-mini-code:free      (100% Free 30B model)
Attempt 4: openrouter/auto                  (Auto fallback model)
Attempt 5: Pollinations AI                  (Zero-dependency, 100% free backup endpoint)
```

### Request Configuration

```javascript
{
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${VITE_OPENROUTER_API_KEY}',
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'PrepMate AI'
  },
  body: JSON.stringify({
    model: selectedModel,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1500
  }),
  signal: AbortController.signal  // 25-35s timeout
}
```

### JSON Response Parsing

All structured AI responses (questions, flashcards, summaries) go through `parseJSONResponse()`:

1. Strip markdown code fences (`` ```json ... ``` ``)
2. Attempt `JSON.parse()` on cleaned text
3. Regex fallback: extract first `{...}` or `[...]` block
4. If all parsing fails, return fallback data

---

## 6. Study Mode — Technical Reference

### Configuration Object (`studyConfig`)

```javascript
{
  board: 'CBSE',              // 'CBSE', 'ICSE', 'State Board'
  pattern: 'NCERT Special',   // 'NCERT Special', 'PYQ-Style', 'Conceptual'
  grade: 'Class 10',          // 'Class 10', 'Class 12'
  subject: 'Science',         // From NCERT syllabus data
  chapter: 'Chemical Reactions', // Chapter name
  unit: 'Balancing Equations',   // Specific unit (optional)
  mode: 'ncert',              // 'ncert', 'custom', 'pdf', 'ocr', 'preset'
  pdfText: '',                // Extracted PDF text
  ocrText: '',                // Extracted OCR text
  customTopic: '',            // Free-text custom topic
  difficulty: 'Medium',
  questionFormat: 'mcq',      // 'mcq', 'subjective', 'mixed'
  questionCount: 5
}
```

### Adaptive Difficulty Algorithm

**File:** `src/utils/adaptiveDifficulty.js`

```javascript
function adjustDifficulty(score, currentDifficulty) {
  if (score >= 8) return nextLevel(currentDifficulty)    // Score 8+ → harder
  if (score <= 4) return prevLevel(currentDifficulty)    // Score 4- → easier
  return currentDifficulty                                // 5-7 → stay
}
```

### Question Generation Prompt Template

```
You are a {board} {grade} {subject} teacher.
Generate a {format} question about: {chapter} → {unit}
Difficulty: {difficulty}
Pattern: {pattern}

Return JSON:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],  // MCQ only
  "correctAnswer": "...",
  "hint": "...",
  "explanation": "..."
}
```

---

## 7. Interview Mode — Technical Reference

### Configuration Object (`interviewConfig`)

```javascript
{
  category: 'job',            // 'job', 'college', 'school_viva'
  role: 'Software Developer', // Job role or branch
  targetCompany: 'Google',    // Target company (optional)
  experience: 'Fresher',      // 'Fresher', 'Mid-Level', 'Senior'
  tone: 'Professional',       // 'Friendly', 'Professional', 'Strict'
  interviewType: 'technical', // 'technical', 'hr', 'mixed'
  pressureMode: false,        // Enable countdown timer
  pressureTime: 120,          // Timer seconds (60-300)
  questionCount: 5
}
```

### Voice Input Integration

The `useVoiceInput` hook wraps the Web Speech Recognition API:

```javascript
const { isListening, transcript, startListening, stopListening } = useVoiceInput()
// transcript updates in real-time as user speaks
// Automatically stops after silence detection
```

---

## 8. Smart Notes — Technical Reference

### Source Object Schema

```javascript
{
  id: 'uuid-string',
  name: 'Chapter 5 Notes.pdf',
  type: 'pdf',              // 'pdf', 'image', 'text', 'youtube'
  text: 'Extracted text...',  // Full extracted content
  selected: true,            // Whether included in analysis
  addedAt: Date.now(),
  meta: {
    numPages: 12,            // PDF only
    charCount: 45000,
    confidence: 92           // OCR only
  }
}
```

### Feature Pipeline

| Feature | Service Function | Output |
|---------|-----------------|--------|
| Summary | `generateDocSummary(text)` | `{ title, oneLiner, keyPoints[], mainConcepts[], studyGuide, difficulty }` |
| Flashcards | `generateFlashcards(text)` | `[{ front, back, category }]` (10 cards) |
| Chat | `chatWithDocument(text, history, question)` | Plain text AI response |
| Audio | `generateAudioScript(text)` | Plain text spoken script (~300 words) |

### YouTube Transcript Extraction

**File:** `src/services/youtubeTranscript.js`

1. Extract video ID from URL
2. Attempt proxy transcript fetch (CORS-free)
3. If blocked, offer manual paste option
4. Fallback: AI-generated summary from video title/description

---

## 9. Authentication System

**File:** `src/context/AuthContext.jsx` + `src/services/firebase.js`

### Flow

```
User clicks "Sign in with Google"
    → Firebase signInWithPopup(GoogleAuthProvider)
    → onAuthStateChanged listener fires
    → AuthContext updates { user, loading }
    → App.jsx conditionally renders authenticated UI
```

### User Object Shape

```javascript
{
  uid: 'firebase-uid',
  displayName: 'Hemant Prakash',
  email: 'hemant@gmail.com',
  photoURL: 'https://...',
  emailVerified: true
}
```

---

## 10. Payment Integration

### Architecture

```
Client (razorpay.js)  →  POST /api/create-order  →  Razorpay API
                                                          │
                                                    Order created
                                                          │
Client opens Checkout  ←  Order ID returned  ←────────────┘
                                                          
User completes payment
                                                          
Client  →  POST /api/verify-payment  →  HMAC-SHA256 verification
                                              │
                                        Signature valid?
                                              │
                                    Yes → { verified: true }
                                    No  → { verified: false }
```

### Plans

| Plan | Monthly | Annual | Amount (paise) |
|------|---------|--------|----------------|
| FREE | ₹0 | ₹0 | 0 |
| PRO | ₹199 | ₹1,999 | 19900 / 199900 |
| ELITE | ₹499 | ₹4,999 | 49900 / 499900 |

---

## 11. Custom Hooks Reference

### `usePDFExtract()`
Extracts text from uploaded PDF files using `pdfjs-dist` worker.

```javascript
const { extractTextFromPDF, extracting, error } = usePDFExtract()
const result = await extractTextFromPDF(file)
// result: { text, numPages, charCount }
```

### `useImageExtract()`
Performs OCR on uploaded images using Tesseract.js.

```javascript
const { extractTextFromImage, extracting, progress, error } = useImageExtract()
const result = await extractTextFromImage(file)
// result: { text, charCount, confidence }
```

### `useVoiceInput()`
Wraps the Web Speech Recognition API for voice-to-text.

```javascript
const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceInput()
```

### `useAudioOverview()`
Controls Web Speech Synthesis for text-to-speech playback.

```javascript
const { isPlaying, voices, selectedVoice, rate, progress, speak, pause, resume, stop } = useAudioOverview()
speak(scriptText)  // Start TTS playback
```

### `use3DScroll()`
Scroll-linked parallax effect for 3D elements on the About page.

---

## 12. 3D & Visual Components

### Three.js Stack

| Component | Library | Purpose |
|-----------|---------|---------|
| `Hero3DCanvas` | React Three Fiber | Canvas wrapper with camera & lighting |
| `HeroOrb` | Three.js Mesh | Animated gradient sphere with vertex displacement |
| `ParticleGrid` | Three.js Points | Floating particle field background |
| `TiltCard` | Vanilla Tilt | CSS 3D perspective card with glare effect |
| `AnimatedCounter` | Pure React | Smooth number counting animation |

### Error Handling

`ThreeErrorBoundary` catches WebGL crashes and renders a graceful fallback gradient instead of a white screen.

---

## 13. Data Layer

### NCERT Syllabus (`src/data/ncertSyllabus.js`)

Structured curriculum data for CBSE boards:

- **Class 10:** Science (16 chapters), Mathematics, Social Science, Computer Science, English
- **Class 12:** Physics (15 chapters), Chemistry, Biology

Each entry includes:
- Chapter name
- Unit-level topics array
- Official NCERT PDF URL

### Preset Questions (`src/data/presetQuestions.js`)

Offline-capable question banks for demo mode:

- **Data Structures** (Study): 20 questions across Easy/Medium/Hard
- **Software Developer HR** (Interview): 20 HR questions
- **Data Analyst Technical** (Interview): 20 technical questions

---

## 14. Error Handling Strategy

| Layer | Strategy |
|-------|----------|
| **AI Service** | 4-model fallback chain → static fallback content |
| **JSON Parsing** | Direct parse → regex extraction → fallback data |
| **PDF/OCR** | try/catch with user-facing error messages |
| **Rendering** | `PageErrorBoundary` component catches React crashes |
| **3D/WebGL** | `ThreeErrorBoundary` with gradient fallback |
| **Network** | AbortController timeouts (25-35s) with retry |
| **Auth** | Optional — app works fully without Google sign-in |

---

## 15. Performance Optimizations

| Optimization | Implementation |
|-------------|---------------|
| **Code Splitting** | 3D components (`HeroOrb`, `ParticleGrid`) are `lazy()` loaded |
| **Tree Shaking** | Vite automatically tree-shakes unused Lucide icons |
| **PDF Worker** | pdfjs uses CDN-hosted worker to avoid bundle bloat |
| **Image Optimization** | WebP-optimized assets in `/public/assets/` |
| **CSS** | Tailwind purges unused classes in production build |
| **Caching** | Vercel CDN caches hashed asset bundles; `index.html` set to `no-cache` |

### Bundle Size

| Chunk | Size | Gzip |
|-------|------|------|
| `index.js` (main) | ~1,186 KB | ~335 KB |
| `react-three-fiber` | ~870 KB | ~234 KB |
| `index.css` | ~56 KB | ~10 KB |
| `HeroOrb.js` | ~5 KB | ~2 KB |
| `ParticleGrid.js` | ~1 KB | ~0.7 KB |

---

## 16. Deployment Guide

### Environment Setup Checklist

- [ ] Create [OpenRouter](https://openrouter.ai/keys) account and generate API key
- [ ] *(Optional)* Create Firebase project with Google Auth enabled
- [ ] *(Optional)* Create Razorpay account with test mode enabled
- [ ] Add all keys to `.env` locally or Vercel environment variables

### Vercel Deployment Steps

1. Push code to GitHub repository
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Set framework preset to **Vite**
4. Add environment variables in Settings → Environment Variables
5. Deploy

### Firebase Auth Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project → Enable Authentication → Add Google provider
3. Add your Vercel domain to **Authorized domains**
4. Copy Web SDK config values into `.env`

---

## 17. Troubleshooting

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `ReferenceError: useEffect is not defined` | Missing React hook import | Ensure `import { useEffect } from 'react'` |
| AI questions not generating | API key missing or expired | Check `VITE_OPENROUTER_API_KEY` in `.env` |
| MCQ options not clickable | AI returned non-array options | Fixed in `studyService.js` — normalizes all formats |
| Smart Notes "searching your notes" error | Model rejected system role | Fixed — system prompt merged into user message |
| PDF upload fails | pdfjs worker not loading | Check CDN worker URL in `usePDFExtract.js` |
| 3D canvas blank | WebGL not supported | `ThreeErrorBoundary` renders gradient fallback |
| Google Auth popup blocked | Browser popup blocker | Allow popups for the domain |
| Vercel deploy stale | Old JS bundle cached | Added `Cache-Control: no-cache` for `index.html` |
| Score shows NaN | Empty scores array | Fixed — normalization with `|| 0` fallback |
| Voice input not working | HTTPS required for mic | Deploy to HTTPS domain (Vercel auto-provides) |

### Debug Commands

```bash
# Check local build for errors
npm run build

# Preview production build
npm run preview

# Check Vercel deployment logs
npx vercel logs <deployment-url>

# Inspect Vercel deployment
npx vercel inspect <deployment-url>
```

---

<p align="center"><em>Documentation maintained by Hemant Prakash · PrepMate AI v1.0.0</em></p>
