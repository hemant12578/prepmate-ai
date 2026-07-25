import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const getScreenFromPath = () => {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.replace('/', '').trim()
  const hash = window.location.hash.replace('#', '').trim()
  const route = path || hash

  if (!route || route === 'dashboard' || route === 'home') return 'home'
  if (route === 'profile') return 'history'
  if (route === 'status') return 'production'

  const validScreens = [
    'home', 'study-setup', 'study-session', 'study-summary',
    'interview-setup', 'interview-session', 'interview-summary',
    'smart-notes', 'history', 'about', 'production', 'pricing'
  ]
  return validScreens.includes(route) ? route : 'home'
}

export function AppProvider({ children }) {
  const [screen, setScreenState] = useState(getScreenFromPath)
  const [mode, setMode] = useState(null) // 'study' or 'interview'

  // Sync state to HTML5 Browser History with clean path URLs (/dashboard, /smart-notes, /profile, /about, /status)
  const setScreen = (newScreen) => {
    setScreenState(newScreen)
    if (typeof window !== 'undefined') {
      const pathAlias = newScreen === 'home' ? '/dashboard' : newScreen === 'history' ? '/profile' : newScreen === 'production' ? '/status' : '/' + newScreen
      if (window.location.pathname !== pathAlias) {
        window.history.pushState(null, '', pathAlias)
      }
    }
  }

  // Handle browser Back / Forward buttons & Path/Hash changes
  useEffect(() => {
    const handlePopState = () => {
      const targetScreen = getScreenFromPath()
      setScreenState(targetScreen)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handlePopState)
    }
  }, [])

  // Persistent Dedicated Mode Configs
  const [studyConfig, setStudyConfigState] = useState(() => {
    try {
      const saved = localStorage.getItem('prepmate_study_config')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const setStudyConfig = (config) => {
    setStudyConfigState(config)
    try {
      if (config) localStorage.setItem('prepmate_study_config', JSON.stringify(config))
      else localStorage.removeItem('prepmate_study_config')
    } catch (e) { console.warn('Failed to save study config:', e) }
  }

  const [interviewConfig, setInterviewConfigState] = useState(() => {
    try {
      const saved = localStorage.getItem('prepmate_interview_config')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const setInterviewConfig = (config) => {
    setInterviewConfigState(config)
    try {
      if (config) localStorage.setItem('prepmate_interview_config', JSON.stringify(config))
      else localStorage.removeItem('prepmate_interview_config')
    } catch (e) { console.warn('Failed to save interview config:', e) }
  }

  const [lastSessionScores, setLastSessionScoresState] = useState(() => {
    try {
      const saved = localStorage.getItem('prepmate_last_scores')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const setLastSessionScores = (scores) => {
    setLastSessionScoresState(scores)
    try {
      localStorage.setItem('prepmate_last_scores', JSON.stringify(scores))
    } catch (e) { console.warn('Failed to save last scores:', e) }
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Legacy fallback states
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')

  // Persistent User Profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('prepmate_user_profile')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  // Persistent Session History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('prepmate_session_history')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const startStudySession = (config) => {
    setStudyConfig(config)
    setMode('study')
    setScreen('study-session')
  }

  const startInterviewSession = (config) => {
    setInterviewConfig(config)
    setMode('interview')
    setScreen('interview-session')
  }

  const saveProfile = (newProfile) => {
    setUserProfile(newProfile)
    try {
      localStorage.setItem('prepmate_user_profile', JSON.stringify(newProfile))
    } catch (e) {
      console.warn('Failed to save profile:', e)
    }
  }

  const addSessionToHistory = (session) => {
    const newEntry = {
      id: 'session_' + Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...session
    }

    setHistory((prevHistory) => {
      const updated = [newEntry, ...prevHistory].slice(0, 100)
      try {
        localStorage.setItem('prepmate_session_history', JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save history:', e)
      }
      return updated
    })
  }

  function resetSession() {
    setScreen('home')
    setMode(null)
    setStudyConfig(null)
    setInterviewConfig(null)
    setError(null)
  }

  const value = {
    screen, setScreen,
    mode, setMode,
    studyConfig, setStudyConfig, startStudySession,
    interviewConfig, setInterviewConfig, startInterviewSession,
    lastSessionScores, setLastSessionScores,
    topic, setTopic,
    difficulty, setDifficulty,
    loading, setLoading,
    error, setError,
    userProfile, saveProfile,
    history, addSessionToHistory,
    resetSession,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
