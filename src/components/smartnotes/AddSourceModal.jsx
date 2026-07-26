import { useState, useRef } from 'react'
import { usePDFExtract } from '../../hooks/usePDFExtract'
import { useImageExtract } from '../../hooks/useImageExtract'
import { extractVideoId, fetchYouTubeTranscript, generateAITranscriptFromVideo } from '../../services/youtubeTranscript'
import { Upload, FileText, Image as ImageIcon, X, Loader2, CheckCircle2, AlertCircle, Sparkles, Wand2 } from 'lucide-react'

function YoutubeIcon({ size = 15, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function AddSourceModal({ isOpen, onClose, onAddSource }) {
  const [activeTab, setActiveTab] = useState('pdf') // 'pdf', 'image', 'text', 'youtube'

  // PDF Tab State
  const { extractTextFromPDF, extracting: pdfExtracting, error: pdfError } = usePDFExtract()
  const pdfInputRef = useRef(null)

  // Image OCR Tab State
  const { extractTextFromImage, extracting: imgExtracting, progress: imgProgress, error: imgError } = useImageExtract()
  const imgInputRef = useRef(null)

  // Text Tab State
  const [textTitle, setTextTitle] = useState('')
  const [textBody, setTextBody] = useState('')

  // YouTube Tab State
  const [ytUrl, setYtUrl] = useState('')
  const [ytLoading, setYtLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [ytError, setYtError] = useState(null)
  const [manualTranscript, setManualTranscript] = useState('')
  const [showManualPaste, setShowManualPaste] = useState(false)

  if (!isOpen) return null

  // Handle PDF Upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await extractTextFromPDF(file)
      onAddSource({
        id: 'src_' + Date.now(),
        type: 'pdf',
        name: file.name,
        text: res.text,
        charCount: res.charCount,
        selected: true,
        addedAt: new Date()
      })
      onClose()
    } catch (err) {
      console.warn('PDF extraction failed:', err)
    }
  }

  // Handle Image Upload & OCR Extraction
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await extractTextFromImage(file)
      onAddSource({
        id: 'src_' + Date.now(),
        type: 'image',
        name: `Image: ${file.name}`,
        text: res.text,
        charCount: res.charCount,
        selected: true,
        addedAt: new Date(),
        imageUrl: URL.createObjectURL(file)
      })
      onClose()
    } catch (err) {
      console.warn('Image extraction failed:', err)
    }
  }

  // Handle Text Submission
  const handleTextSubmit = () => {
    if (!textBody.trim()) return
    onAddSource({
      id: 'src_' + Date.now(),
      type: 'text',
      name: textTitle.trim() || `Text Note ${Date.now().toString().slice(-4)}`,
      text: textBody.trim(),
      charCount: textBody.length,
      selected: true,
      addedAt: new Date()
    })
    setTextTitle('')
    setTextBody('')
    onClose()
  }

  // Handle YouTube Fetch (Instant 1-step processing)
  const handleYtFetch = async () => {
    if (!ytUrl.trim()) return
    const vId = extractVideoId(ytUrl)
    if (!vId) {
      setYtError('Invalid YouTube URL format. Please paste a valid YouTube video or live stream link.')
      return
    }

    setYtLoading(true)
    setYtError(null)

    try {
      const { text, videoId, title } = await fetchYouTubeTranscript(ytUrl)
      onAddSource({
        id: 'src_' + Date.now(),
        type: 'youtube',
        name: title || `YouTube: ${videoId}`,
        text,
        charCount: text.length,
        selected: true,
        addedAt: new Date(),
        videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      })
      setYtUrl('')
      setShowManualPaste(false)
      onClose()
    } catch (err) {
      setYtLoading(false)
      setShowManualPaste(true)
      setYtError("Could not auto-fetch captions. Click below to synthesize with AI or paste transcript manually:")
    } finally {
      setYtLoading(false)
    }
  }

  // Handle AI Transcript Generation Fallback
  const handleAiSynthesize = async () => {
    const vId = extractVideoId(ytUrl) || 'video'
    setAiGenerating(true)
    try {
      const text = await generateAITranscriptFromVideo(vId, ytUrl)
      onAddSource({
        id: 'src_' + Date.now(),
        type: 'youtube',
        name: `YouTube: ${vId}`,
        text,
        charCount: text.length,
        selected: true,
        addedAt: new Date(),
        videoId: vId,
        thumbnailUrl: `https://img.youtube.com/vi/${vId}/mqdefault.jpg`
      })
      setYtUrl('')
      setShowManualPaste(false)
      onClose()
    } catch (e) {
      setYtError('Could not generate AI transcript. Please paste text manually below.')
    } finally {
      setAiGenerating(false)
    }
  }

  // Handle Manual YouTube Transcript Submission
  const handleManualYtSubmit = () => {
    if (!manualTranscript.trim()) return
    const vId = extractVideoId(ytUrl) || 'video'
    onAddSource({
      id: 'src_' + Date.now(),
      type: 'youtube',
      name: `YouTube: ${vId}`,
      text: manualTranscript.trim(),
      charCount: manualTranscript.length,
      selected: true,
      addedAt: new Date(),
      videoId: vId,
      thumbnailUrl: `https://img.youtube.com/vi/${vId}/mqdefault.jpg`
    })
    setYtUrl('')
    setManualTranscript('')
    setShowManualPaste(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in">
      <div className="glass rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-purple-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Add Source Document</h2>
          <p className="text-xs text-slate-400">Add PDFs, Images (OCR), Notes, or YouTube lectures for AI analysis.</p>
        </div>

        {/* 4 Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06] mb-6">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pdf' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={14} className="text-red-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'image' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon size={14} className="text-emerald-400" />
            <span>Image OCR</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'text' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} className="text-blue-400" />
            <span>Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'youtube' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <YoutubeIcon size={14} className="text-red-500" />
            <span>YouTube</span>
          </button>
        </div>

        {/* Tab 1: PDF Upload */}
        {activeTab === 'pdf' && (
          <div
            onClick={() => pdfInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-purple-500/[0.02] group"
          >
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
            {pdfExtracting ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="animate-spin text-purple-400" size={32} />
                <p className="text-xs text-purple-300 font-medium">Extracting PDF text with pdfjs-dist...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Click to select PDF document</p>
                  <p className="text-xs text-slate-500">Supports PDF files up to 10MB</p>
                </div>
              </div>
            )}
            {pdfError && <p className="text-xs text-red-400 mt-4">{pdfError}</p>}
          </div>
        )}

        {/* Tab 2: Image Upload & OCR */}
        {activeTab === 'image' && (
          <div
            onClick={() => imgInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-emerald-500/[0.02] group"
          >
            <input
              ref={imgInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imgExtracting ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="animate-spin text-emerald-400" size={32} />
                <p className="text-xs text-emerald-300 font-medium">Recognizing image text with Tesseract OCR ({imgProgress}%)...</p>
                <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${imgProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ImageIcon size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Upload Photo / Textbook Screenshot</p>
                  <p className="text-xs text-slate-500">Extracts printed & handwritten text automatically (OCR)</p>
                </div>
              </div>
            )}
            {imgError && <p className="text-xs text-red-400 mt-4">{imgError}</p>}
          </div>
        )}

        {/* Tab 3: Paste Text */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Source Title (Optional)
              </label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="e.g. Chapter 4 Chemistry Notes"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Text Content
              </label>
              <textarea
                value={textBody}
                onChange={(e) => setTextBody(e.target.value)}
                placeholder="Paste your notes, articles, or lecture text here..."
                rows={6}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/40 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-slate-500">{textBody.length} characters</span>
                <button
                  onClick={handleTextSubmit}
                  disabled={!textBody.trim()}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 disabled:opacity-40"
                >
                  <CheckCircle2 size={14} />
                  <span>Add to Sources</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: YouTube Video */}
        {activeTab === 'youtube' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                YouTube Video or Live Stream URL
              </label>
              <input
                type="url"
                value={ytUrl}
                onChange={(e) => {
                  setYtUrl(e.target.value)
                  setYtError(null)
                }}
                placeholder="e.g. https://www.youtube.com/live/O7D915KHvpU or https://youtu.be/..."
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500/40"
              />
            </div>

            {ytError && !showManualPaste && (
              <p className="text-xs text-red-400">{ytError}</p>
            )}



            {!showManualPaste ? (
              <button
                onClick={handleYtFetch}
                disabled={!ytUrl.trim() || ytLoading}
                className="w-full btn-primary py-3 rounded-2xl text-xs font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg shadow-purple-500/20"
              >
                {ytLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing YouTube Video...</span>
                  </>
                ) : (
                  <>
                    <YoutubeIcon size={16} />
                    <span>Fetch Transcript & Add Source</span>
                  </>
                )}
              </button>
            ) : (
              /* Manual Transcript Fallback & AI Synthesis */
              <div className="space-y-3 pt-2 border-t border-white/5 animate-in">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{ytError}</span>
                  </div>
                </div>

                <button
                  onClick={handleAiSynthesize}
                  disabled={aiGenerating}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Synthesizing Educational AI Transcript...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={14} className="text-purple-400" />
                      <span>Auto-Synthesize Educational AI Transcript</span>
                    </>
                  )}
                </button>

                <textarea
                  value={manualTranscript}
                  onChange={(e) => setManualTranscript(e.target.value)}
                  placeholder="Or paste transcript text manually here..."
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500/40 resize-none"
                />
                <button
                  onClick={handleManualYtSubmit}
                  disabled={!manualTranscript.trim()}
                  className="w-full btn-primary py-3 rounded-2xl text-xs font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <CheckCircle2 size={14} />
                  <span>Add Manual Transcript Source</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
