# 📓 PrepMate AI — NotebookLM Features Addition Prompt
> Paste this into Claude or ChatGPT AFTER your main app is working
> This adds 4 NotebookLM-style learning features to the existing PrepMate AI app

---

## PROMPT — COPY EVERYTHING BELOW THIS LINE

```
I already have a working PrepMate AI app built with React (Vite) + Tailwind CSS + OpenRouter AI API.

I want to add a new section called "Smart Notes" — a NotebookLM-style learning feature with 4 sub-features.

## WHAT ALREADY EXISTS
- Home screen with Study Mode and Interview Mode
- Quiz/question flow with AI feedback
- User auth with Google (name shown in navbar)
- Dashboard with session history
- Dark theme (#0f172a bg, #7c3aed purple accent)

## NEW SECTION TO ADD: "Smart Notes"

Add a third card on the home/dashboard screen called:
📓 Smart Notes
"Upload your notes or PDFs — AI creates summaries, flashcards, audio overviews and lets you chat with your content."
[Open Smart Notes →]

This opens a new page/route: /smart-notes

---

## SMART NOTES PAGE LAYOUT

The Smart Notes page has:
1. A top area to upload a PDF or paste text
2. Four feature tabs below: Summary | Flashcards | Chat | Audio
3. These tabs only activate AFTER content is uploaded/pasted

---

## FEATURE 1: PDF/Notes Upload & AI Summary

### Upload Section (shown first, before any tab)
- Two options side by side:
  a) "Upload PDF" — file input that accepts .pdf files only
  b) "Paste Notes" — a large textarea where user pastes text

- When PDF is uploaded:
  - Use pdfjs-dist to extract all text from the PDF
  - Show "Extracted X pages, Y characters" as confirmation
  - Store extracted text in state as `docText`

- When text is pasted:
  - Store directly as `docText`

- After content is loaded, show a "Generate Summary" button

### Summary Generation
- Send `docText` to OpenRouter with this prompt:
  "You are a study assistant. Analyze this document and return ONLY a JSON object:
  {
    title: string (infer a title from the content),
    oneLiner: string (one sentence summary),
    keyPoints: string[] (6-8 most important points),
    mainConcepts: string[] (important terms/concepts with brief definitions, format: 'Term: definition'),
    studyGuide: string (3-4 paragraph structured study guide based on this content),
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  }
  
  Document content: {docText}"

- Display summary in a clean card layout:
  - Title at top with difficulty badge
  - One-liner in italic
  - Key Points as a numbered list with checkboxes (visual only)
  - Main Concepts as pill/tag cards
  - Study Guide as readable paragraphs

---

## FEATURE 2: Auto-Generate Flashcards

### How it works
- Button "Generate Flashcards" sends `docText` to OpenRouter:
  "You are a study coach. Create flashcards from this document.
  Return ONLY a JSON array of 10-15 flashcard objects:
  [
    { front: string (question or term), back: string (answer or definition), category: string },
    ...
  ]
  Make questions that test real understanding, not just memorization.
  Document: {docText}"

### Flashcard UI
- Show cards one at a time in the center of screen
- Card has a flip animation on click (CSS 3D transform)
  - Front: shows the question/term on a dark purple card
  - Back: shows the answer/definition on a slightly lighter card
- Below the card:
  - "← Previous" and "Next →" buttons
  - Card counter: "Card 3 of 12"
  - Two buttons: "✓ Got it" (marks card green) and "✗ Review Again" (marks card red)
- Progress bar at top showing how many cards marked as "got it"
- At the end: show score like "You knew 9/12 cards!"

### Flashcard styles
- Card container: fixed size, centered, with perspective CSS for 3D flip
- Front of card: #1e293b background, question in large white text
- Back of card: #2d1b69 background (deep purple), answer in white
- Smooth 0.6s flip transition on click
- Small "Click to flip" hint text below card

---

## FEATURE 3: Chat With Your Notes

### How it works
- Chat interface like a messaging app
- User types a question about their uploaded document
- AI answers ONLY based on the document content (not general knowledge)
- Keep full conversation history in state for multi-turn context

### Chat UI
- Messages area (scrollable, takes up most of the screen)
- Each message has:
  - User message: right-aligned, purple bubble
  - AI message: left-aligned, dark card with small robot icon
- Input area at bottom: text input + Send button
- Show typing indicator (animated dots) while AI responds

### API Call for chat
Send to OpenRouter:
System message: "You are a helpful study assistant. Answer questions ONLY based on the provided document. If the answer is not in the document, say 'I could not find that in your notes.' Be concise and clear. Document content: {docText}"

Messages: full conversation history array + new user message

Return format: plain text response (not JSON for chat)

### Starter prompts (show as clickable chips before first message)
- "Summarize the main idea"
- "What are the key concepts?"
- "Create 3 practice questions from this"
- "Explain the hardest part simply"
- "What should I focus on for an exam?"

---

## FEATURE 4: Audio Overview

### How it works
- Button "Generate Audio Script" sends `docText` to OpenRouter:
  "You are a podcast host creating an educational audio overview.
  Write a 2-3 minute spoken script (about 350-450 words) explaining this document as if you're talking to a student.
  Make it conversational, engaging, not robotic.
  Start with 'Hey, welcome to your PrepMate audio overview...'
  Include: what the topic is, the 3-4 most important things to know, and end with a motivational closing line.
  Return ONLY the script as plain text, no JSON, no formatting marks."

### Audio Playback UI
- After script is generated, show the script text in a scrollable card
- Below it, a simple audio player UI (custom built, not HTML audio element):
  - Big play/pause button (▶ / ⏸)
  - Progress bar (visual only, updates as speech progresses)
  - Speed selector: 0.75x / 1x / 1.25x / 1.5x
  - Voice selector dropdown (use available browser voices)

### Implementation using Web Speech API (FREE, no external API)
Use window.speechSynthesis:

```javascript
// in a custom hook: useAudioOverview.js
const speak = (text, rate = 1, voiceIndex = 0) => {
  const utterance = new SpeechSynthesisUtterance(text)
  const voices = speechSynthesis.getVoices()
  if (voices[voiceIndex]) utterance.voice = voices[voiceIndex]
  utterance.rate = rate
  utterance.onstart = () => setIsPlaying(true)
  utterance.onend = () => setIsPlaying(false)
  utterance.onboundary = (e) => updateProgress(e)
  speechSynthesis.speak(utterance)
}

const pause = () => speechSynthesis.pause()
const resume = () => speechSynthesis.resume()
const stop = () => {
  speechSynthesis.cancel()
  setIsPlaying(false)
}
```

- Get available voices with speechSynthesis.getVoices() and show top 4-5 English voices in dropdown
- Show a subtle animated equalizer (3-4 bars moving up and down) while audio is playing

---

## FOLDER STRUCTURE TO ADD

```
src/
├── pages/
│   └── SmartNotes.jsx          (main page with tabs)
├── components/smartnotes/
│   ├── UploadSection.jsx       (PDF upload + text paste)
│   ├── SummaryView.jsx         (display AI summary)
│   ├── FlashcardDeck.jsx       (flashcard with flip)
│   ├── ChatWithNotes.jsx       (chat interface)
│   └── AudioOverview.jsx       (audio player UI)
├── hooks/
│   ├── usePDFExtract.js        (pdfjs-dist text extraction)
│   └── useAudioOverview.js     (Web Speech API logic)
├── services/
│   └── smartnotes.js           (OpenRouter calls for all 4 features)
```

---

## PACKAGE TO INSTALL
Only one new package needed:
```
npm install pdfjs-dist
```

For pdfjs-dist setup in Vite, add this to the top of usePDFExtract.js:
```javascript
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
```

---

## DESIGN RULES (match existing app)
- Background: #0f172a
- Cards: #1e293b with #334155 border
- Purple accent: #7c3aed
- All new components must match the existing dark theme exactly
- Tab switcher: pill-style tabs, active tab has purple background
- All cards have rounded-xl and subtle border

---

## HUMAN-LIKE CODE RULES (very important)
- Write code like a real developer added this in a hurry
- Some variable names can be short: `txt`, `cards`, `idx`, `msg`
- Leave a casual comment here and there: `// pdfjs needs this or it breaks`
- Not every sub-component needs to be in its own file — if it's small, just put it inline
- The audio hook can have a `// TODO: add word highlighting later` comment
- Chat component can have a `console.log` for the API response that wasn't removed
- Flashcard flip can use a local `useState` inside the component instead of context
- Do NOT write JSDoc, do NOT add PropTypes, do NOT over-engineer

---

## NAVIGATION
- Add "Smart Notes" to the navbar next to "Dashboard"
- Route: /smart-notes (add to existing React Router setup)
- The SmartNotes page should have a "← Back to Home" link at top left

---

## IMPORTANT NOTES
1. docText should be truncated to first 8000 characters before sending to OpenRouter to avoid token limits — add a small warning if doc is truncated: "Note: Only first 8000 characters analyzed due to API limits"
2. All 4 features should be disabled/greyed out until content is uploaded
3. Show loading states for Summary and Flashcards generation (both take 3-5 seconds)
4. Chat should feel instant — show typing dots immediately while waiting
5. Audio feature should check if speechSynthesis is supported: if (!window.speechSynthesis) show "Audio not supported in this browser"

Generate all files completely with full working code.
```

---

## 💡 How To Use This Prompt

- Paste into **Claude.ai** for best results after your main app is working
- Make sure your main app routes are working first before adding this
- If output cuts off, reply: **"continue from where you left off"**
- After getting all files, test in this order:
  1. Upload a PDF → check text extraction works
  2. Generate Summary → check JSON parsing
  3. Generate Flashcards → check flip animation
  4. Try Chat → ask 2-3 questions
  5. Generate Audio → click play

---

## ⏱️ Suggested Build Order

| Step | Task | Time |
|------|------|------|
| 1 | Install pdfjs-dist, set up route + SmartNotes page shell | 30 mins |
| 2 | Build Upload Section (PDF + paste text) | 45 mins |
| 3 | Build Summary feature | 1 hour |
| 4 | Build Flashcards with flip animation | 1 hour |
| 5 | Build Chat with Notes | 1 hour |
| 6 | Build Audio Overview | 45 mins |
| 7 | Polish UI + connect navbar link | 30 mins |

**Total: ~5.5 hours**

---

## 🏆 Why This Makes You Win

Most hackathon Gen AI projects only do Q&A. You are now building:
- ✅ Quiz + Interview Coach (already done)
- ✅ PDF understanding (like NotebookLM)
- ✅ Flashcard generation (like Anki but AI-powered)
- ✅ Document chat (like ChatPDF)
- ✅ Audio overview (like NotebookLM's podcast feature)

That is **5 features in one app** — judges will be genuinely impressed.

---

*NotebookLM Features Prompt v1.0 — PrepMate AI — InnovaHack Chapter 1*
