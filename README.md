# PrepMate AI 🤖

AI-powered study & interview coach. Practice any topic, get instant feedback.

Built for InnovaHack Chapter 1.

## Setup

```bash
npm install
```

Grab a free API key from [openrouter.ai/keys](https://openrouter.ai/keys) and drop it in `.env`:

```
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Then run it:

```bash
npm run dev
```

## How it works

- Pick Study or Interview mode
- Enter a topic or job role
- Answer 5 AI-generated questions
- Get feedback after each one
- See your final summary with strengths, gaps, and resources

Difficulty adapts based on how you're doing — score high and questions get harder.

## Tech

- React + Vite
- Tailwind CSS
- OpenRouter AI (free tier, using mistral-7b)
- No backend, everything runs client-side

## Free models that work

- `mistralai/mistral-7b-instruct:free` (recommended)
- `meta-llama/llama-3-8b-instruct:free`
- `google/gemma-7b-it:free`
