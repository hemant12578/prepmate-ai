<p align="center">
  <img src="public/logo.png" alt="PrepMate AI Logo" width="120" height="120" style="border-radius: 24px;" />
</p>

<h1 align="center">PrepMate AI</h1>

<p align="center">
  <strong>🧠 AI-Powered Personalized Study Coach & Interview Simulator</strong>
</p>

<p align="center">
  <em>Adaptive practice questions · Structured AI feedback · Multi-source smart notes · Voice-interactive interviews</em>
</p>

<p align="center">
  <a href="https://prepmate-ai-sooty.vercel.app"><img src="https://img.shields.io/badge/🌐_Live_Demo-prepmate--ai-7c3aed?style=for-the-badge" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Firebase-Auth-dd2c00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Built_for-InnovaHack_Chapter_1-ff6b6b?style=flat-square" alt="Hackathon" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [AI Models & Engine](#-ai-models--engine)
- [Feature Deep Dive](#-feature-deep-dive)
- [API Reference](#-api-reference)
- [Design System](#-design-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**PrepMate AI** is a production-ready, AI-powered educational platform that combines three powerful learning modes into one seamless experience:

| Mode | What it does |
|------|-------------|
| **📚 Study Mode** | Generates adaptive MCQ + subjective questions from any NCERT chapter, custom topic, uploaded PDF, or OCR-scanned image. AI evaluates answers with detailed feedback and adjusts difficulty dynamically. |
| **🎤 Interview Mode** | Simulates real job, college admission, and school viva interviews with voice input, pressure timer, and AI-generated structured feedback with scoring rubrics. |
| **📝 Smart Notes** | A NotebookLM-style workspace — upload PDFs, images, paste text, or YouTube transcripts. AI generates executive summaries, interactive flashcard decks, document Q&A chat, and podcast-style audio overviews. |

> Built as a solo developer project for **InnovaHack Chapter 1** hackathon — scoring **95.5/100** in the final evaluation.

---

## 🌐 Live Demo

**🔗 [https://prepmate-ai-sooty.vercel.app](https://prepmate-ai-sooty.vercel.app)**

| Page | URL |
|------|-----|
| Landing Page | `/` |
| Dashboard | `/dashboard` |
| Study Setup | `/study-setup` |
| Interview Setup | `/interview-setup` |
| Smart Notes | `/smart-notes` |
| About | `/about` |
| Pricing | `/pricing` |
| System Status | `/status` |

---

## ✨ Key Features

### 🎯 Study Mode (14 Features)
- ✅ NCERT syllabus integration (Class 10 & 12 — Physics, Chemistry, Biology, Mathematics, Computer Science)
- ✅ Chapter-wise & unit-wise question generation
- ✅ Custom topic free-text input
- ✅ PDF upload → text extraction → question generation
- ✅ Image OCR (Tesseract.js) → question generation
- ✅ MCQ & Subjective question formats
- ✅ AI-powered answer evaluation with detailed scoring (0–10)
- ✅ Adaptive difficulty engine (Easy → Medium → Hard)
- ✅ Hint system for MCQ questions
- ✅ Configurable question count (3–15)
- ✅ Board selection (CBSE, ICSE, State Board)
- ✅ Pattern selection (NCERT Special, PYQ-Style, Conceptual)
- ✅ Real-time progress tracking
- ✅ End-of-session AI summary with strengths, gaps, and recommended resources

### 🎤 Interview Mode (12 Features)
- ✅ Job interview simulation (50+ roles — Software Developer, Data Analyst, Product Manager, etc.)
- ✅ College admission interviews
- ✅ School viva voice simulations
- ✅ Voice input via Web Speech API (speak your answers)
- ✅ Pressure mode with configurable countdown timer
- ✅ AI tone selection (Friendly, Professional, Strict)
- ✅ Target company context (Google, Microsoft, startup, etc.)
- ✅ Experience level calibration (Fresher → Senior)
- ✅ Per-question structured feedback with scoring rubric
- ✅ End-of-session performance radar with strengths and improvement areas
- ✅ Adaptive follow-up question generation
- ✅ Session history with score tracking

### 📝 Smart Notes (8 Features)
- ✅ Multi-source document ingestion (PDF, Image OCR, Text paste, YouTube transcript)
- ✅ AI-generated executive summary with key takeaways
- ✅ Interactive 3D flip flashcard deck generation
- ✅ Document Q&A chat assistant (strictly document-based)
- ✅ Podcast-style audio overview with Web Speech Synthesis
- ✅ Voice & speed controls for audio playback
- ✅ Multi-source selection & combined analysis
- ✅ Persistent source storage (localStorage)

### 🎨 Platform Features
- ✅ Google Authentication (Firebase Auth)
- ✅ 3D animated landing page (React Three Fiber + Three.js)
- ✅ Glassmorphic UI with custom cursor
- ✅ Fully responsive mobile design
- ✅ Razorpay payment integration (PRO & ELITE tiers)
- ✅ Session history dashboard
- ✅ User profile & onboarding flow
- ✅ System status monitoring page
- ✅ SEO-optimized with Open Graph meta tags

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with functional components & hooks |
| **Vite 5** | Lightning-fast build tool & dev server |
| **Tailwind CSS 3.4** | Utility-first styling with custom design tokens |
| **Three.js + React Three Fiber** | 3D WebGL animations on landing & about pages |
| **Framer Motion** | Page transitions and micro-animations |
| **Lucide React** | Consistent icon system (200+ icons) |
| **Vanilla Tilt** | Hardware-accelerated 3D card tilt effects |

### AI & Processing
| Technology | Purpose |
|-----------|---------|
| **OpenRouter API** | Multi-model AI gateway (4 model fallback chain) |
| **pdfjs-dist** | Client-side PDF text extraction |
| **Tesseract.js** | Client-side OCR for image text recognition |
| **Web Speech API** | Voice input (STT) and audio playback (TTS) |

### Backend & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Firebase Auth** | Google OAuth 2.0 authentication |
| **Vercel** | Edge deployment with serverless API functions |
| **Razorpay** | Payment gateway (INR) with HMAC verification |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React SPA)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Study    │  │ Interview│  │  Smart   │              │
│  │  Mode     │  │  Mode    │  │  Notes   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                    │
│  ┌────▼──────────────▼──────────────▼────┐              │
│  │         Service Layer                  │              │
│  │  ┌─────────────┐ ┌────────────────┐   │              │
│  │  │ openrouter.js│ │ smartnotes.js  │   │              │
│  │  │ studyService │ │ interviewSvc   │   │              │
│  │  └──────┬──────┘ └───────┬────────┘   │              │
│  └─────────┼────────────────┼────────────┘              │
│            │                │                            │
├────────────┼────────────────┼────────────────────────────┤
│            ▼                ▼                            │
│  ┌─────────────────────────────────────┐                │
│  │        OpenRouter AI Gateway         │                │
│  │  Model Fallback Chain:               │                │
│  │  1. openrouter/auto                  │                │
│  │  2. meta-llama/llama-3.1-8b:free     │                │
│  │  3. google/gemma-2-9b-it:free        │                │
│  │  4. qwen/qwen-2.5-7b:free           │                │
│  └─────────────────────────────────────┘                │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Firebase Auth │  │  Razorpay    │  │ Web Speech   │  │
│  │ (Google SSO)  │  │  Payments    │  │ API (TTS/STT)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              VERCEL EDGE FUNCTIONS (/api)                 │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ /api/create-order │  │/api/verify-payment│             │
│  │ (Razorpay Order)  │  │(HMAC-SHA256 Verify)│            │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
prepmate-ai/
├── api/                           # Vercel serverless edge functions
│   ├── create-order.js            # Razorpay order creation endpoint
│   └── verify-payment.js          # Razorpay HMAC-SHA256 payment verification
│
├── public/                        # Static assets
│   ├── assets/                    # Feature banners & images
│   ├── logo.png                   # App logo (favicon source)
│   └── og-image.png               # Open Graph social preview image
│
├── src/
│   ├── components/
│   │   ├── 3d/                    # Three.js & WebGL components
│   │   │   ├── AnimatedCounter.jsx    # Smooth number animation (stats)
│   │   │   ├── Hero3DCanvas.jsx       # Main 3D canvas wrapper
│   │   │   ├── HeroOrb.jsx           # Animated gradient orb (hero)
│   │   │   ├── ParticleGrid.jsx       # Floating particle grid background
│   │   │   ├── ThreeErrorBoundary.jsx # WebGL crash fallback
│   │   │   └── TiltCard.jsx           # 3D perspective tilt card
│   │   │
│   │   ├── interview/             # Interview mode components
│   │   │   ├── InterviewFeedback.jsx  # Per-question AI feedback card
│   │   │   ├── InterviewQuestion.jsx  # Question display + voice input
│   │   │   └── PressureTimer.jsx      # Countdown pressure timer
│   │   │
│   │   ├── smartnotes/            # Smart Notes workspace components
│   │   │   ├── AddSourceModal.jsx     # Multi-tab source upload modal
│   │   │   ├── AudioOverview.jsx      # TTS audio player with controls
│   │   │   ├── ChatWithNotes.jsx      # Document Q&A chat interface
│   │   │   ├── FlashcardDeck.jsx      # 3D flip flashcard carousel
│   │   │   ├── SourcesSidebar.jsx     # Source list with toggle selection
│   │   │   ├── SummaryView.jsx        # AI summary with checklist
│   │   │   └── UploadSection.jsx      # Drag-and-drop upload area
│   │   │
│   │   ├── study/                 # Study mode components
│   │   │   ├── StudyFeedback.jsx      # Per-question AI feedback
│   │   │   └── StudyQuestion.jsx      # MCQ/Subjective question card
│   │   │
│   │   ├── shared/                # Reusable UI components
│   │   │   ├── BoardSelector.jsx      # CBSE/ICSE/State board picker
│   │   │   └── QuestionCounter.jsx    # Question count slider
│   │   │
│   │   ├── CustomCursor.jsx       # Custom animated cursor
│   │   ├── FeedbackCard.jsx       # Generic feedback display
│   │   ├── HistoryDashboard.jsx   # Session history list
│   │   ├── Home.jsx               # Dashboard home screen
│   │   ├── LandingPage.jsx        # Marketing landing page
│   │   ├── Loader.jsx             # Loading spinner
│   │   ├── OnboardingModal.jsx    # First-time user setup wizard
│   │   ├── PageErrorBoundary.jsx  # Runtime error boundary
│   │   ├── QuestionCard.jsx       # Legacy question card
│   │   ├── Setup.jsx              # Legacy setup screen
│   │   └── Summary.jsx            # Legacy summary screen
│   │
│   ├── context/                   # React Context providers
│   │   ├── AppContext.jsx         # Global app state + routing + history
│   │   └── AuthContext.jsx        # Firebase auth state + Google SSO
│   │
│   ├── data/                      # Static data & syllabus
│   │   ├── ncertSyllabus.js       # NCERT Class 10 & 12 chapter/unit data
│   │   └── presetQuestions.js     # Offline demo question banks
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use3DScroll.js         # Scroll-linked 3D parallax
│   │   ├── useAudioOverview.js    # Web Speech TTS player hook
│   │   ├── useImageExtract.js     # Tesseract.js OCR wrapper
│   │   ├── usePDFExtract.js       # pdfjs-dist text extraction
│   │   └── useVoiceInput.js       # Web Speech STT voice input
│   │
│   ├── pages/                     # Page-level route components
│   │   ├── About.jsx              # About page with 3D stats
│   │   ├── InterviewSession.jsx   # Active interview session
│   │   ├── InterviewSetup.jsx     # Interview configuration
│   │   ├── InterviewSummary.jsx   # Post-interview AI summary
│   │   ├── Pricing.jsx            # Subscription tiers (Free/Pro/Elite)
│   │   ├── Production.jsx         # System status & monitoring
│   │   ├── SmartNotes.jsx         # Smart Notes workspace
│   │   ├── StudySession.jsx       # Active study session
│   │   ├── StudySetup.jsx         # Study configuration
│   │   └── StudySummary.jsx       # Post-study AI summary
│   │
│   ├── services/                  # API & business logic
│   │   ├── firebase.js            # Firebase app initialization
│   │   ├── interviewService.js    # Interview question & eval AI calls
│   │   ├── openrouter.js          # Core AI service (study mode)
│   │   ├── razorpay.js            # Razorpay checkout integration
│   │   ├── smartnotes.js          # Smart Notes AI (summary, cards, chat)
│   │   ├── studyService.js        # Study question & eval AI calls
│   │   └── youtubeTranscript.js   # YouTube transcript fetching
│   │
│   ├── utils/                     # Utility functions
│   │   └── adaptiveDifficulty.js  # Score-based difficulty adjustment
│   │
│   ├── App.jsx                    # Root component with routing & navbar
│   ├── index.css                  # Global styles & glassmorphism
│   └── main.jsx                   # React DOM entry point
│
├── .env.example                   # Environment variable template
├── index.html                     # HTML entry with SEO meta tags
├── package.json                   # Dependencies & scripts
├── tailwind.config.js             # Tailwind theme & custom animations
├── vite.config.js                 # Vite build configuration
└── vercel.json                    # Vercel deployment & routing config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A free [OpenRouter](https://openrouter.ai/keys) API key
- *(Optional)* Firebase project for Google Auth
- *(Optional)* Razorpay test/live keys for payments

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hemant12578/prepmate-ai.git
cd prepmate-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section below)

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build     # Creates optimized bundle in /dist
npm run preview   # Preview production build locally
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_OPENROUTER_API_KEY` | ✅ **Yes** | OpenRouter API key — get one free at [openrouter.ai/keys](https://openrouter.ai/keys) |
| `VITE_FIREBASE_API_KEY` | ⚡ Optional | Firebase Web API key for Google Authentication |
| `VITE_FIREBASE_AUTH_DOMAIN` | ⚡ Optional | Firebase Auth domain (`your-project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | ⚡ Optional | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ⚡ Optional | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ⚡ Optional | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | ⚡ Optional | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | ⚡ Optional | Firebase analytics measurement ID |
| `VITE_RAZORPAY_KEY_ID` | ⚡ Optional | Razorpay publishable key (for payments UI) |
| `RAZORPAY_KEY_ID` | ⚡ Optional | Razorpay key ID (for serverless API) |
| `RAZORPAY_KEY_SECRET` | ⚡ Optional | Razorpay secret key (for serverless API) |

> **Note:** The app works with just `VITE_OPENROUTER_API_KEY`. Firebase auth and Razorpay are optional features.

---

## 🌍 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Or link to existing project
vercel link
vercel --prod --yes
```

**Important:** Add all environment variables in **Vercel Dashboard → Settings → Environment Variables** before deploying.

### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/index.html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

---

## 🤖 AI Models & Engine

PrepMate AI uses **OpenRouter** as a multi-model AI gateway with an automatic fallback chain:

```
Request Flow:
  1. openrouter/auto          ← Tries best available model
  2. meta-llama/llama-3.1-8b  ← Fast, reliable fallback
  3. google/gemma-2-9b-it     ← Google's open model
  4. qwen/qwen-2.5-7b         ← Final fallback
```

### Timeout & Retry Strategy

| Parameter | Value |
|-----------|-------|
| Request timeout | 25–35 seconds |
| Max retry attempts | 4 (one per model) |
| Temperature | 0.7 (balanced creativity) |
| Max tokens | 1000–1500 |

### AI Capabilities

| Feature | AI Task |
|---------|---------|
| Study Questions | Generate MCQ/subjective questions with options, hints, and correct answers |
| Answer Evaluation | Score answers 0–10 with detailed feedback, model answers, and concept explanations |
| Interview Questions | Generate role-specific, difficulty-calibrated interview questions |
| Document Summary | Extract title, key points, concepts, and structured study guide from text |
| Flashcard Generation | Create 10 question-answer flashcards with category tags |
| Document Chat | Answer student questions strictly based on uploaded document content |
| Audio Script | Generate conversational podcast-style spoken overview script |
| Session Summary | Produce comprehensive performance analysis with strengths, gaps, and resources |

---

## 🔬 Feature Deep Dive

### 📚 Study Mode Pipeline

```
User Input (Topic/PDF/Image/NCERT Chapter)
    │
    ▼
┌──────────────────┐
│  Source Processing │
│  • PDF → pdfjs    │
│  • Image → OCR    │
│  • NCERT → Data   │
│  • Text → Direct  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  AI Question Gen  │  ← Prompt: subject + topic + difficulty + format
│  (openrouter.js)  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  User Answers     │  ← MCQ selection or text input
│  (StudyQuestion)  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  AI Evaluation    │  ← Score (0-10) + feedback + model answer
│  + Adaptive Diff  │  ← adjustDifficulty(score, currentLevel)
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Session Summary  │  ← Strengths, gaps, recommended resources
│  (StudySummary)   │
└──────────────────┘
```

### 🎤 Interview Mode Pipeline

```
User Config (Role + Company + Experience + Tone + Timer)
    │
    ▼
┌──────────────────┐
│  AI Question Gen  │  ← Context-aware interview questions
│  (interviewSvc)   │
└────────┬─────────┘
         ▼
┌──────────────────────┐
│  User Answer          │
│  • Text input         │
│  • 🎤 Voice (STT)    │
│  • ⏱ Pressure Timer  │
└────────┬─────────────┘
         ▼
┌──────────────────┐
│  AI Evaluation    │  ← Scoring rubric + ideal answer + tips
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Performance      │  ← Radar chart, overall grade, action items
│  Summary          │
└──────────────────┘
```

---

## 📡 API Reference

### Serverless Functions (`/api/`)

#### `POST /api/create-order`

Creates a Razorpay payment order.

```json
// Request Body
{
  "amount": 19900,    // Amount in paise (₹199 = 19900)
  "plan": "pro"       // "pro" or "elite"
}

// Response
{
  "id": "order_xxxxx",
  "amount": 19900,
  "currency": "INR"
}
```

#### `POST /api/verify-payment`

Verifies Razorpay payment signature using HMAC-SHA256.

```json
// Request Body
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "hmac_signature_string"
}

// Response
{ "verified": true }
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `dark.bg` | `#0f172a` | Page background |
| `dark.card` | `#1e293b` | Card surfaces |
| `dark.border` | `#334155` | Borders & dividers |
| `accent` | `#7c3aed` | Primary brand violet |
| `accent.light` | `#a855f7` | Hover states, gradients |

### Typography

- **Font Family:** [Inter](https://fonts.google.com/specimen/Inter) (400, 500, 600, 700, 800)
- **Scale:** Tailwind default with `text-xs` through `text-4xl`

### Custom Animations

| Animation | Duration | Effect |
|-----------|----------|--------|
| `blob` | 8s infinite | Organic floating blob movement |
| `gradient` | 6s infinite | Background gradient position shift |
| `float` | 6s infinite | Vertical floating motion (20px) |
| `glow-pulse` | 3s infinite | Opacity pulse (0.4–0.8) |
| `fadeInUp` | 0.5s | Entry animation (opacity + translateY) |

### Glassmorphism

```css
.glass {
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(148, 163, 184, 0.08);
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes and commit
git commit -m "feat: add amazing feature"

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Commit Convention

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Code formatting (no logic change) |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvement |
| `chore:` | Build tools, dependencies |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hemant Prakash**

- GitHub: [@hemant12578](https://github.com/hemant12578)

---

<p align="center">
  <strong>⭐ If PrepMate AI helped you, consider giving it a star!</strong>
</p>

<p align="center">
  Built with ❤️ and lots of ☕ for InnovaHack Chapter 1
</p>
