import { useState, useRef, useEffect } from 'react'
import { chatWithDocument } from '../../services/smartnotes'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'

export default function ChatWithNotes({ docText }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Smart Assistant. Ask me anything directly based on your uploaded document notes.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const starterChips = [
    'Summarize the main idea',
    'What are the key concepts?',
    'Create 3 practice questions',
    'Explain the hardest part simply'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages, loading])

  const handleSend = async (textToSend) => {
    const msg = textToSend || input
    if (!msg.trim() || !docText || loading) return

    const newMessages = [...messages, { role: 'user', text: msg }]
    setMessages(newMessages)
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const aiReply = await chatWithDocument(docText, messages, msg)
      // console.log('Chat API response:', aiReply)
      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }])
    } catch (err) {
      console.warn('Chat failed:', err)
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error searching your document notes.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl flex flex-col h-[550px] animate-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="text-purple-400" size={20} />
          <h3 className="text-sm font-bold text-white">Document Q&A Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([
              { role: 'assistant', text: 'Hello! I am your AI Smart Assistant. Ask me anything directly based on your uploaded document notes.' }
            ])}
            className="text-[10px] text-slate-400 hover:text-purple-300 bg-white/5 hover:bg-purple-500/20 px-2.5 py-1 rounded-full border border-white/10 transition-colors"
          >
            Clear Chat
          </button>
          <span className="text-[10px] text-slate-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 hidden sm:inline-block">
            Strictly Document-Based
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <Bot size={14} />
              </div>
            )}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
              m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/[0.03] border border-white/[0.06] text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Bot size={14} />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
              <div className="dot-pulse"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter Chips */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 my-3">
          {starterChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.06] text-[11px] text-purple-300 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="pt-3 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your document..."
          className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500/40"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="btn-primary px-5 rounded-2xl text-white flex items-center justify-center disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
