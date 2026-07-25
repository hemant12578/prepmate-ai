export default function Loader({ text = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in">
      <div className="space-y-3 w-full max-w-md mb-6">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-20 w-full mt-4" />
      </div>
      <div className="flex items-center gap-3">
        <div className="dot-pulse">
          <span /><span /><span />
        </div>
        <p className="text-slate-500 text-sm">{text}</p>
      </div>
    </div>
  )
}
