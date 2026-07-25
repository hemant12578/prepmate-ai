# 📋 PrepMate AI — Product Requirements Document (PRD)

**Version:** 1.0  
**Hackathon:** InnovaHack Chapter 1 — Round 1  
**Domain:** Gen AI — Problem Statement 2  
**App Name:** PrepMate AI  
**Tagline:** _Your AI-powered Study & Interview Coach_  
**Tech Stack:** React (Vite) + Tailwind CSS + OpenRouter AI API  
**Team Size:** 2  
**Timeline:** 24 Hours  

---

## 1. 🎯 Problem Statement

Preparing for exams or job interviews is often generic and one-size-fits-all. Learners need adaptive, personalized feedback based on their real strengths and gaps — not a static list of questions from Google.

---

## 2. 💡 Solution Overview

**PrepMate AI** is a web application with two modes:

- 📚 **Study Mode** — Enter any topic, get AI-generated practice questions, answer them, and receive structured feedback with a score.
- 💼 **Interview Mode** — Enter any job role, get HR + technical questions, answer them, and receive feedback highlighting strengths, gaps, and resources.

Both modes use **adaptive difficulty** — questions get harder or easier based on your performance.

---

## 3. 👥 Target Users

- Students preparing for exams (school, college, competitive)
- Freshers preparing for job interviews
- Working professionals switching careers
- Anyone who wants to test their knowledge on any topic

---

## 4. 🔑 Core Features

### 4.1 Landing Page
- App name + tagline
- Two big buttons: **Study Mode** and **Interview Mode**
- Clean, dark-themed professional UI

### 4.2 Study Mode
- User inputs a **topic** (e.g., "Data Structures", "Photosynthesis", "World War 2")
- User selects **difficulty**: Easy / Medium / Hard
- AI generates **5 questions** one at a time
- User types answer in a text box
- After each answer → AI evaluates and gives instant feedback
- After all 5 questions → **Summary screen** with:
  - Total Score (e.g., 3/5)
  - Strengths identified
  - Gaps identified
  - Suggested resources
  - Option to retry or go home

### 4.3 Interview Mode
- User inputs a **job role** (e.g., "Frontend Developer", "Data Analyst", "Product Manager")
- User selects **interview type**: HR / Technical / Mixed
- AI generates **5 questions** one at a time
- User types answer in a text box
- After each answer → AI evaluates and gives instant feedback
- After all 5 questions → **Summary screen** with:
  - Overall Interview Score
  - Communication strengths
  - Technical gaps
  - Suggested improvement resources
  - Option to retry or go home

### 4.4 Adaptive Difficulty
- If user scores 80%+ on first 3 questions → next questions increase in difficulty
- If user scores below 40% → next questions decrease in difficulty
- Difficulty level shown as a badge on each question

### 4.5 Feedback Structure (Per Question)
```
✅ Score: X/10
💪 What you got right: ...
⚠️ What you missed: ...
💡 Ideal answer: ...
```

### 4.6 Summary Screen
```
🎯 Final Score: X/5
💪 Your Strengths: ...
📌 Your Gaps: ...
📚 Suggested Resources: ...
🔁 [Try Again] [Change Topic] [Go Home]
```

---

## 5. 🖥️ UI Screens

| Screen | Description |
|--------|-------------|
| Home | Two mode cards — Study & Interview |
| Setup | Topic/Role input + Difficulty selector |
| Question | Question display + Answer text area + Submit button |
| Feedback | Per-question feedback after each answer |
| Summary | Final score + strengths + gaps + resources |

---

## 6. 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| AI API | OpenRouter AI (free tier) |
| Recommended Model | `mistralai/mistral-7b-instruct` or `openai/gpt-3.5-turbo` via OpenRouter |
| State Management | React useState + useContext (no database needed) |
| Deployment | Vercel or Netlify (free) |

---

## 7. 🔌 OpenRouter API Setup

### Base URL
```
https://openrouter.ai/api/v1/chat/completions
```

### Headers
```json
{
  "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
  "Content-Type": "application/json",
  "HTTP-Referer": "YOUR_SITE_URL",
  "X-Title": "PrepMate AI"
}
```

### Recommended Free Models on OpenRouter
- `mistralai/mistral-7b-instruct:free`
- `meta-llama/llama-3-8b-instruct:free`
- `google/gemma-7b-it:free`

---

## 8. 🤖 AI Prompt Templates

### 8.1 Question Generation Prompt (Study Mode)
```
You are a study coach. Generate 1 practice question on the topic: "{topic}".
Difficulty level: {difficulty} (Easy/Medium/Hard).
Previous score trend: {scoreTrend} (improving/declining/stable).

Return ONLY a JSON object in this exact format:
{
  "question": "your question here",
  "difficulty": "Easy/Medium/Hard",
  "type": "short-answer"
}
```

### 8.2 Question Generation Prompt (Interview Mode)
```
You are an interview coach. Generate 1 {type} interview question for the role: "{role}".
Difficulty level: {difficulty}.
Previous score trend: {scoreTrend}.

Return ONLY a JSON object in this exact format:
{
  "question": "your question here",
  "difficulty": "Easy/Medium/Hard",
  "type": "HR/Technical"
}
```

### 8.3 Answer Evaluation Prompt
```
You are an expert evaluator. Evaluate this answer:

Topic/Role: {topicOrRole}
Question: {question}
User's Answer: {userAnswer}

Return ONLY a JSON object in this exact format:
{
  "score": 7,
  "whatYouGotRight": "...",
  "whatYouMissed": "...",
  "idealAnswer": "...",
  "encouragement": "..."
}

Score should be out of 10. Be encouraging but honest.
```

### 8.4 Summary Generation Prompt
```
You are a learning coach. Based on these results, give a final summary:

Topic/Role: {topicOrRole}
Mode: {mode}
Questions and scores: {questionsAndScores}

Return ONLY a JSON object in this exact format:
{
  "totalScore": "4/5",
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "suggestedResources": ["resource1", "resource2", "resource3"],
  "motivationalMessage": "..."
}
```

---

## 9. 📁 Project Folder Structure

```
prepmate-ai/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── Setup.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── FeedbackCard.jsx
│   │   ├── Summary.jsx
│   │   └── Loader.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── services/
│   │   └── openrouter.js
│   ├── utils/
│   │   └── adaptiveDifficulty.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 10. 🔄 User Flow

```
Home Screen
    ↓
[Study Mode] or [Interview Mode]
    ↓
Setup Screen (Enter topic/role + select difficulty)
    ↓
Question 1 → User Answers → AI Feedback
    ↓
Question 2 → User Answers → AI Feedback
    ↓
Question 3 → (Adaptive difficulty adjusts here)
    ↓
Question 4 → User Answers → AI Feedback
    ↓
Question 5 → User Answers → AI Feedback
    ↓
Summary Screen (Score + Strengths + Gaps + Resources)
    ↓
[Try Again] or [Home]
```

---

## 11. 📊 Scoring & Adaptive Logic

| Condition | Action |
|-----------|--------|
| Score ≥ 8/10 on last question | Increase difficulty |
| Score ≤ 4/10 on last question | Decrease difficulty |
| Score 5–7/10 | Keep same difficulty |
| Overall ≥ 80% | "Excellent" badge |
| Overall 50–79% | "Good" badge |
| Overall < 50% | "Keep Practicing" badge |

---

## 12. 🎨 UI Design Guidelines

- **Theme:** Dark background (#0f0f0f or #111827)
- **Accent Color:** Purple/Violet (#7c3aed or #8b5cf6)
- **Text:** White primary, gray secondary
- **Font:** Inter or Poppins
- **Cards:** Rounded corners, subtle border, slight glow effect
- **Buttons:** Gradient purple, hover effect
- **Animations:** Smooth fade-in on question load

---

## 13. 🚀 MVP vs Full Version

### ✅ MVP (Build First — Hours 0–8)
- Home screen with 2 modes
- Setup screen
- 5 questions per session
- Answer text area
- AI evaluation per question
- Basic summary screen

### 🌟 Full Version (Polish — Hours 8–16)
- Adaptive difficulty working
- Beautiful feedback cards
- Animated score counter
- Mobile responsive
- Suggested resources on summary
- Motivational messages

### 💎 Bonus (If Time Allows — Hours 16–20)
- Session history (stored in localStorage)
- Share result as image
- Voice input for answers

---

## 14. 🌐 Deployment

- Push to **GitHub**
- Connect to **Vercel** (vercel.com)
- Add environment variable: `VITE_OPENROUTER_API_KEY=your_key`
- Deploy in 2 minutes — get a live URL for submission

---

## 15. 📝 Submission Checklist

- [ ] Deployed URL working
- [ ] Both Study & Interview modes working
- [ ] PPT ready (7 slides)
- [ ] Google Drive link set to public
- [ ] Google Form filled with: Team Name, Leader, Members, Track
- [ ] Submitted before 26 July 2026, 10:00 AM IST

---

*PRD Version 1.0 — PrepMate AI — InnovaHack Chapter 1*
