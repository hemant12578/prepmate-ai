import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import SourcesSidebar from '../components/smartnotes/SourcesSidebar'
import AddSourceModal from '../components/smartnotes/AddSourceModal'
import SummaryView from '../components/smartnotes/SummaryView'
import FlashcardDeck from '../components/smartnotes/FlashcardDeck'
import ChatWithNotes from '../components/smartnotes/ChatWithNotes'
import AudioOverview from '../components/smartnotes/AudioOverview'
import { generateDocSummary } from '../services/smartnotes'
import { ChevronLeft, Sparkles, BookOpen, RotateCw, MessageSquare, Volume2, Plus, Layers, CheckSquare, Menu } from 'lucide-react'

// helper to get combined text of all selected sources
const getCombinedText = (sources) => {
  const selected = sources.filter(s => s.selected)
  if (selected.length === 0) return ''
  
  return selected.map(s => 
    `[Source: ${s.name}]\n${s.text}`
  ).join('\n\n---\n\n')
}

export default function SmartNotes() {
  const { setScreen } = useApp()
  const [sources, setSources] = useState(() => {
    try {
      const saved = localStorage.getItem('prepmate_smartnotes_sources')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const [activeTab, setActiveTab] = useState('summary') // 'summary', 'flashcards', 'chat', 'audio'
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('prepmate_smartnotes_sources', JSON.stringify(sources))
    } catch (e) {
      console.warn('Failed to save sources:', e)
    }
  }, [sources])

  // Source Handlers
  const handleAddSource = (newSource) => {
    setSources(prev => [newSource, ...prev])
  }

  const handleToggleSelect = (id) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s))
  }

  const handleDeleteSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id))
  }

  const handleToggleAll = () => {
    const selectedCount = sources.filter(s => s.selected).length
    const targetState = selectedCount !== sources.length
    setSources(prev => prev.map(s => ({ ...s, selected: targetState })))
  }

  const combinedText = getCombinedText(sources)
  const selectedSourcesCount = sources.filter(s => s.selected).length
  const selectedSourceNames = sources.filter(s => s.selected).map(s => s.name).join(', ')

  const handleGenerateSummary = async () => {
    if (!combinedText) return
    setSummaryLoading(true)
    try {
      const res = await generateDocSummary(combinedText)
      setSummary(res)
      setActiveTab('summary')
    } catch (err) {
      console.warn('Summary generation error:', err)
    } finally {
      setSummaryLoading(false)
    }
  }

  // Auto-generate summary when sources are first selected
  useEffect(() => {
    if (combinedText && !summary && !summaryLoading) {
      handleGenerateSummary()
    }
  }, [combinedText])

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: RotateCw },
    { id: 'chat', label: 'Chat with Notes', icon: MessageSquare },
    { id: 'audio', label: 'Audio Overview', icon: Volume2 },
  ]

  return (
    <div className="animate-in max-w-7xl mx-auto py-4">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Mobile Sources Drawer Toggle */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden px-3.5 py-1.5 rounded-xl glass-light border border-white/10 text-xs font-semibold text-purple-300 flex items-center gap-2"
        >
          <Menu size={14} />
          <span>Sources ({selectedSourcesCount}/{sources.length})</span>
        </button>
      </div>

      {/* Main Page Layout: Left Sidebar + Right Main Area */}
      <div className="flex gap-6 items-start">
        {/* Left Sidebar (280px) */}
        <SourcesSidebar
          sources={sources}
          onToggleSelect={handleToggleSelect}
          onDeleteSource={handleDeleteSource}
          onToggleAll={handleToggleAll}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          mobileOpen={mobileDrawerOpen}
          onCloseMobile={() => setMobileDrawerOpen(false)}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Title Banner */}
          <div className="glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="h-32 relative overflow-hidden">
              <img src="/assets/smart_notes.jpg" alt="Smart Notes" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
            </div>

            <div className="p-6 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-light text-xs text-purple-300 mb-2 border border-purple-500/20">
                  <Sparkles size={12} />
                  <span>Multi-Source PrepNotes AI Engine</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Smart Notes Workspace</h1>
                <p className="text-xs text-slate-400">
                  {selectedSourcesCount > 0
                    ? `Analyzing ${selectedSourcesCount} selected source${selectedSourcesCount > 1 ? 's' : ''}: ${selectedSourceNames}`
                    : 'Add PDFs, Images, Notes, or YouTube video transcripts to analyze combined content.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {selectedSourcesCount > 0 && (
                  <button
                    onClick={handleGenerateSummary}
                    disabled={summaryLoading}
                    className="px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-purple-500/20 border border-white/15 text-purple-200 flex items-center gap-2 transition-all shadow-md"
                    title="Regenerate summary from selected sources"
                  >
                    <RotateCw size={14} className={summaryLoading ? 'animate-spin text-purple-400' : 'text-purple-400'} />
                    <span>{summaryLoading ? 'Generating...' : 'Regenerate Summary'}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-purple-500/20 shrink-0"
                >
                  <Plus size={16} />
                  <span>+ Add Source</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feature Tabs Header */}
          <div className="flex items-center gap-2 flex-wrap bg-white/[0.02] p-1.5 rounded-2xl border border-white/[0.06]">
            {tabs.map((t) => {
              const Icon = t.icon
              const isDisabled = !combinedText
              return (
                <button
                  key={t.id}
                  onClick={() => !isDisabled && setActiveTab(t.id)}
                  disabled={isDisabled}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                    activeTab === t.id && !isDisabled
                      ? 'bg-purple-500/25 border-purple-500/40 text-white shadow-md'
                      : isDisabled
                      ? 'bg-transparent border-transparent text-slate-600 cursor-not-allowed'
                      : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* EMPTY STATES */}
          {sources.length === 0 ? (
            /* Empty State 1: No sources added */
            <div className="glass rounded-3xl p-12 text-center border border-white/10 animate-in">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-4">
                <Layers size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No sources yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Add a PDF, image notes, paste text, or drop in a YouTube lecture to get started.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary px-7 py-3 rounded-2xl text-xs font-semibold text-white inline-flex items-center gap-2 shadow-xl shadow-purple-500/20"
              >
                <Plus size={16} />
                <span>Add First Source</span>
              </button>
            </div>
          ) : !combinedText ? (
            /* Empty State 2: Sources added but 0 selected */
            <div className="glass rounded-3xl p-12 text-center border border-white/10 animate-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <CheckSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select sources to continue</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Check the sources on the left sidebar that you want the AI to analyze combined.
              </p>
              <button
                onClick={handleToggleAll}
                className="px-6 py-2.5 rounded-xl glass-light border border-white/10 text-xs font-semibold text-purple-300 hover:text-white"
              >
                Select All Sources
              </button>
            </div>
          ) : (
            /* PERSISTENT TAB VIEWS: Mounted simultaneously with CSS visibility toggle to preserve state */
            <div className="min-h-[400px]">
              <div className={activeTab === 'summary' ? 'block' : 'hidden'}>
                <SummaryView summary={summary} loading={summaryLoading} onGenerate={handleGenerateSummary} />
              </div>

              <div className={activeTab === 'flashcards' ? 'block' : 'hidden'}>
                <FlashcardDeck docText={combinedText} />
              </div>

              <div className={activeTab === 'chat' ? 'block' : 'hidden'}>
                <ChatWithNotes docText={combinedText} />
              </div>

              <div className={activeTab === 'audio' ? 'block' : 'hidden'}>
                <AudioOverview docText={combinedText} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Source Modal */}
      <AddSourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSource={handleAddSource}
      />
    </div>
  )
}
