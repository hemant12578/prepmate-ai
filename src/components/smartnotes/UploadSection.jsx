import { useState, useRef } from 'react'
import { usePDFExtract } from '../../hooks/usePDFExtract'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react'

export default function UploadSection({ docText, setDocText, metaInfo, setMetaInfo, onGenerateSummary }) {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'paste'
  const [pastedText, setPastedText] = useState('')
  const { extractTextFromPDF, extracting, error } = usePDFExtract()
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await extractTextFromPDF(file)
      setDocText(res.text)
      setMetaInfo({
        fileName: file.name,
        pages: res.numPages,
        charCount: res.charCount,
        isTruncated: res.charCount > 8000
      })
    } catch (err) {
      console.warn('PDF extraction failed:', err)
    }
  }

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return
    setDocText(pastedText.trim())
    setMetaInfo({
      fileName: 'Pasted Notes',
      pages: 1,
      charCount: pastedText.length,
      isTruncated: pastedText.length > 8000
    })
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 shadow-2xl animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-purple-400" size={20} />
            <span>Document & Notes Input</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Upload a PDF or paste your study notes to unlock AI Smart Features.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'paste' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Upload PDF Box */}
      {activeTab === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-purple-500/[0.02] group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {extracting ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="animate-spin text-purple-400" size={32} />
              <p className="text-xs text-purple-300 font-medium">Extracting PDF text...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Click to upload PDF document</p>
                <p className="text-xs text-slate-500">Supports PDF files up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Paste Notes Textarea */
        <div className="space-y-4">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your lecture notes, textbook chapters, or study material here..."
            rows={6}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/40 transition-all resize-none"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={!pastedText.trim()}
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
          >
            <span>Confirm Pasted Text</span>
            <CheckCircle2 size={14} />
          </button>
        </div>
      )}

      {/* Confirmation & Status Bar */}
      {docText && metaInfo && (
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in">
          <div className="flex items-center gap-3 text-xs">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-white font-medium">{metaInfo.fileName}</p>
              <p className="text-slate-400 text-[11px]">
                Extracted {metaInfo.pages} page{metaInfo.pages > 1 ? 's' : ''}, {metaInfo.charCount} characters
              </p>
            </div>
          </div>

          {metaInfo.isTruncated && (
            <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <AlertCircle size={12} />
              Note: Only first 8000 characters analyzed due to API limits
            </span>
          )}

          <button
            onClick={onGenerateSummary}
            className="w-full sm:w-auto btn-primary px-6 py-3 rounded-2xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Sparkles size={14} />
            <span>Generate AI Summary & Unlock Features</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
