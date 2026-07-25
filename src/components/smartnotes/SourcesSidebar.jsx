import { BookOpen, Plus, FileText, Image as ImageIcon, Trash2, CheckSquare, Square, X, Layers } from 'lucide-react'

function YoutubeIcon({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

// magic numbers for width: min-w-[280px]
export default function SourcesSidebar({
  sources,
  onToggleSelect,
  onDeleteSource,
  onToggleAll,
  onOpenAddModal,
  mobileOpen,
  onCloseMobile
}) {
  const selectedCount = sources.filter(s => s.selected).length
  const allSelected = sources.length > 0 && selectedCount === sources.length

  const getSourceBadge = (type) => {
    switch (type) {
      case 'pdf':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-semibold border border-red-500/20">PDF</span>
      case 'image':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-500/20">Image</span>
      case 'youtube':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-semibold border border-red-500/20">YouTube</span>
      case 'text':
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-500/20">Text</span>
    }
  }

  const getSourceIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={15} className="text-red-400 shrink-0" />
      case 'image': return <ImageIcon size={15} className="text-emerald-400 shrink-0" />
      case 'youtube': return <YoutubeIcon size={15} className="text-red-500 shrink-0" />
      case 'text':
      default: return <FileText size={15} className="text-blue-400 shrink-0" />
    }
  }

  // TODO: add drag to reorder sources someday

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a] border-r border-[#1e293b] p-4 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="text-purple-400" size={18} />
          <h3 className="text-sm font-bold text-white tracking-tight">Sources</h3>
        </div>
        {mobileOpen && (
          <button onClick={onCloseMobile} className="p-1 rounded-lg text-slate-400 hover:text-white sm:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Add Source Button */}
      <button
        onClick={onOpenAddModal}
        className="w-full btn-primary py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 mb-4"
      >
        <Plus size={16} />
        <span>Add Source</span>
      </button>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sources.length === 0 ? (
          <div className="text-center py-10 px-2 text-slate-500 text-xs">
            <Layers size={28} className="mx-auto mb-2 opacity-40 text-purple-400" />
            <p>No sources added yet.</p>
            <p className="text-[11px] mt-1">Add PDF, image notes, text, or YouTube video transcripts.</p>
          </div>
        ) : (
          sources.map((src) => (
            <div
              key={src.id}
              onClick={() => onToggleSelect(src.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-2 ${
                src.selected
                  ? 'bg-[#1e1040] border-l-4 border-l-[#7c3aed] border-purple-500/30 text-white shadow-sm'
                  : 'bg-[#1e293b] border-[#334155] text-slate-300 hover:brightness-110'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={src.selected}
                  onChange={() => {}}
                  className="accent-purple-500 rounded shrink-0 cursor-pointer"
                />

                {/* YouTube / Image Thumbnail if available */}
                {src.type === 'youtube' && src.thumbnailUrl ? (
                  <img
                    src={src.thumbnailUrl}
                    alt=""
                    className="w-10 h-7 object-cover rounded shrink-0 border border-white/10"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : src.type === 'image' && src.imageUrl ? (
                  <img
                    src={src.imageUrl}
                    alt=""
                    className="w-8 h-8 object-cover rounded shrink-0 border border-white/10"
                  />
                ) : (
                  getSourceIcon(src.type)
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate text-white">{src.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getSourceBadge(src.type)}
                    <span className="text-[10px] text-slate-400">{(src.charCount / 1000).toFixed(1)}k chars</span>
                  </div>
                </div>
              </div>

              {/* Hover Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSource(src.id)
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all shrink-0"
                title="Delete source"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Controls */}
      {sources.length > 0 && (
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 mt-2">
          <span>{selectedCount} of {sources.length} selected</span>
          <button
            onClick={onToggleAll}
            className="text-[11px] text-purple-300 hover:text-white font-medium transition-colors"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (280px wide) */}
      <aside className="hidden md:block min-w-[280px] w-[280px] h-[calc(100vh-80px)] sticky top-16 rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-in">
          <div className="w-80 max-w-[85vw] h-full bg-[#0f172a] shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
