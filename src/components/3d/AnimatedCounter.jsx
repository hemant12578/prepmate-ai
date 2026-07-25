import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function AnimatedCounter({ end = 0, suffix = '', prefix = '', duration = 2000, className = '' }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (!inView) return

    const targetNum = typeof end === 'number' ? end : parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0
    if (targetNum <= 0) {
      setCount(targetNum)
      return
    }

    let start = 0
    const step = targetNum / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= targetNum) {
        setCount(targetNum)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [inView, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
