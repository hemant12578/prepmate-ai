import React from 'react'
import { RefreshCcw, AlertTriangle } from 'lucide-react'

export default class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Page Render Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4 border border-red-500/20 my-10 animate-in">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Something went wrong loading this screen</h3>
          <p className="text-xs text-slate-400">An unexpected rendering error occurred:</p>
          <div className="text-xs text-red-300 font-mono text-left bg-black/50 p-3.5 rounded-xl border border-red-500/20 overflow-x-auto whitespace-pre-wrap">
            {this.state.error ? String(this.state.error) : 'Unknown Error'}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2"
          >
            <RefreshCcw size={14} />
            <span>Reload Application</span>
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
