# 🤖 PrepMate AI — Code Generation Prompt
> Paste this entire prompt into Claude or ChatGPT to generate the full code

---

## PROMPT — COPY EVERYTHING BELOW THIS LINE

```
You are an expert React developer. Build me a complete, fully working web application called "PrepMate AI" — an AI-powered Study & Interview Coach.

## TECH STACK
- React with Vite
- Tailwind CSS (dark theme)
- OpenRouter AI API (https://openrouter.ai/api/v1/chat/completions)
- No backend, no database — all state in React memory
- Model to use: mistralai/mistral-7b-instruct:free

## APP OVERVIEW
Two modes in one app:
1. Study Mode — user enters a topic, gets 5 AI-generated questions one by one, answers them, gets AI feedback per answer, then sees a summary
2. Interview Mode — user enters a job role, selects HR/Technical/Mixed, gets 5 questions, answers them, gets AI feedback, then sees a summary

## SCREENS TO BUILD

### Screen 1: Home (/)
- Dark background, purple accent color
- App name "PrepMate AI" with tagline "Your AI-powered Study & Interview Coach"
- Two big cards: Study Mode and Interview Mode
- Each card has an icon, title, description and a "Start" button

### Screen 2: Setup
- For Study Mode: text input for topic + difficulty selector (Easy/Medium/Hard)
- For Interview Mode: text input for job role + interview type selector (HR/Technical/Mixed) + difficulty selector
- "Start Session" button

### Screen 3: Question
- Shows current question number (e.g., Question 2/5)
- Displays the question in a card
- Difficulty badge (Easy/Medium/Hard)
- Large textarea for user to type answer
- "Submit Answer" button
- Loading spinner while AI generates question or evaluates

### Screen 4: Feedback (shown after each answer)
- Score out of 10 with colored badge (green ≥7, yellow 5-6, red ≤4)
- "What you got right" section
- "What you missed" section  
- "Ideal Answer" section
- "Next Question" button (or "See Summary" if last question)

### Screen 5: Summary
- Final score (e.g., 4/5 questions, average 7.2/10)
- Performance badge (Excellent/Good/Keep Practicing)
- Strengths list
- Gaps list
- Suggested resources list
- Motivational message
- Two buttons: "Try Again" and "Go Home"

## OPENROUTER API INTEGRATION

Create a file src/services/openrouter.js with these functions:

### Function 1: generateQuestion(topic, mode, difficulty, questionNumber, previousScores)
Call OpenRouter with this prompt:
- For Study Mode: "You are a study coach. Generate 1 practice question on the topic: '{topic}'. Difficulty: {difficulty}. This is question {questionNumber} of 5. Return ONLY JSON: { question: string, difficulty: string, hint: string }"
- For Interview Mode: "You are an interview coach. Generate 1 {interviewType} interview question for the role: '{role}'. Difficulty: {difficulty}. This is question {questionNumber} of 5. Return ONLY JSON: { question: string, difficulty: string, type: string }"

### Function 2: evaluateAnswer(topic, mode, question, userAnswer)
Call OpenRouter with this prompt:
"You are an expert evaluator. Topic/Role: {topic}. Question: {question}. User Answer: {userAnswer}. Evaluate and return ONLY JSON: { score: number (1-10), whatYouGotRight: string, whatYouMissed: string, idealAnswer: string, encouragement: string }"

### Function 3: generateSummary(topic, mode, questionsAndScores)
Call OpenRouter with this prompt:
"You are a learning coach. Topic/Role: {topic}. Mode: {mode}. Results: {questionsAndScores}. Generate summary and return ONLY JSON: { totalScore: string, averageScore: number, performanceBadge: string, strengths: string[], gaps: string[], suggestedResources: string[], motivationalMessage: string }"

## ADAPTIVE DIFFICULTY LOGIC
- Start at selected difficulty
- After each question: if score >= 8 → increase difficulty; if score <= 4 → decrease difficulty; else keep same
- Difficulty order: Easy → Medium → Hard
- Pass updated difficulty to next generateQuestion call

## FOLDER STRUCTURE TO CREATE
```
src/
├── components/
│   ├── Home.jsx
│   ├── Setup.jsx
│   ├── QuestionCard.jsx
│   ├── FeedbackCard.jsx
│   ├── Summary.jsx
│   └── Loader.jsx
├── services/
│   └── openrouter.js
├── utils/
│   └── adaptiveDifficulty.js
├── context/
│   └── AppContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## DESIGN REQUIREMENTS
- Background: #0f172a (very dark blue-black)
- Primary accent: #7c3aed (purple)
- Secondary accent: #a855f7 (light purple)
- Cards: #1e293b background with #334155 border
- Text: white primary, #94a3b8 secondary
- Buttons: gradient from #7c3aed to #a855f7
- Rounded corners everywhere (rounded-xl or rounded-2xl)
- Smooth transitions and hover effects
- Fully mobile responsive

## ENVIRONMENT VARIABLE
API key stored in .env as:
VITE_OPENROUTER_API_KEY=your_key_here

Access in code as: import.meta.env.VITE_OPENROUTER_API_KEY

## IMPORTANT RULES
1. Parse all AI responses as JSON — wrap in try/catch in case of parsing errors
2. Show a loading spinner every time an API call is in progress
3. Handle errors gracefully — show error message if API fails
4. Keep all session state in React useState (no localStorage needed for MVP)
5. Make sure the app works end to end — Home → Setup → 5 Questions with Feedback → Summary

## ALSO PROVIDE
1. Complete package.json with all dependencies
2. tailwind.config.js setup
3. vite.config.js setup
4. .env.example file
5. A README.md with setup instructions:
   - npm install
   - Add API key to .env
   - npm run dev
   - How to get free OpenRouter API key

Generate ALL files completely with full working code. Do not use placeholder comments like "// add logic here". Every function must be fully implemented.

## MOST IMPORTANT — WRITE LIKE A REAL HUMAN DEVELOPER

This is the most critical instruction. The code and file structure must look like it was written by a real developer, NOT generated by AI. Follow every rule below strictly:

### Code Style Rules
- Write code the way a slightly tired but experienced developer would — not perfectly clean, not overly documented
- Variable names should be natural and sometimes abbreviated the way a real dev would: `idx` instead of `index`, `res` instead of `response`, `err` instead of `error`, `q` instead of `question` in small scopes
- Do NOT write a comment above every single line — real developers only comment the confusing parts
- Comments should sound casual: `// this is a bit hacky but it works` or `// TODO: clean this up later` or `// not sure why this fixes it but it does`
- Avoid over-engineering — a real junior-to-mid developer would not use 5 layers of abstraction for a hackathon project
- Some functions can be slightly longer than "best practice" — real devs don't always split everything perfectly
- Mix arrow functions and regular functions naturally — don't be consistent in a robotic way
- Leave one or two small things slightly imperfect — like a console.log that wasn't removed, or a CSS class that's slightly redundant

### File & Folder Naming Rules
- Folder and file names should look like choices a real developer made quickly — not like a perfectly planned enterprise project
- It is okay to have one or two helper functions just sitting in App.jsx instead of their own file — real devs do this in hackathons
- The README should sound like a developer wrote it fast — short sentences, no corporate language, maybe one typo that wasn't caught

### Component Rules
- Components should not be perfectly split — sometimes a component can do two things if a real dev was in a hurry
- Props should not always have PropTypes defined — junior devs skip this often
- Use a mix of inline styles and Tailwind classes occasionally — real devs do this when they're moving fast
- Not every component needs a loading state handled perfectly — just the important ones

### Git & Project Feel Rules
- package.json scripts should look like a real dev set it up: just `dev`, `build`, `preview` — no fancy extra scripts
- The .env.example should have a comment like `# get this from openrouter.ai/keys` — casual, not formal documentation
- vite.config.js should be minimal — just what's needed, nothing more

### What To AVOID
- Do NOT write JSDoc comments (/** @param ... */) — no real hackathon dev does this
- Do NOT write perfectly consistent spacing everywhere — real code has minor inconsistencies
- Do NOT name every variable with full descriptive names like `currentQuestionIndex` — a real dev writes `qIdx` or just `i`
- Do NOT add "Best Practices" comments or architecture explanations inside the code
- Do NOT make every component a perfectly isolated, reusable, generic component — this is a hackathon, not a design system
- Do NOT write `// eslint-disable` comments — just write normal code
- Avoid making the code look like it came from a tutorial or documentation example
```

---

## 💡 Tips For Using This Prompt

- Paste into **Claude.ai** (claude.ai) for best results
- If the output is too long and cuts off, reply: **"continue from where you left off"**
- After getting all files, ask: **"Now give me the openrouter.js file in full"** to make sure it's complete
- If any component is missing, ask: **"Give me the complete [ComponentName].jsx file"**

---

## 🔑 How To Get Free OpenRouter API Key

1. Go to **openrouter.ai**
2. Sign up with Google
3. Go to **Keys** section
4. Click **Create Key**
5. Copy the key
6. Paste it in your `.env` file as `VITE_OPENROUTER_API_KEY=sk-or-...`

Free models available (no payment needed):
- `mistralai/mistral-7b-instruct:free` ✅ Recommended
- `meta-llama/llama-3-8b-instruct:free` ✅ Good alternative
- `google/gemma-7b-it:free` ✅ Backup option

---

*Code Generation Prompt v2.0 — PrepMate AI — InnovaHack Chapter 1*
