import { useEffect, useState } from 'react'

export default function AnimatedCounter({ end = 0, suffix = '', prefix = '', duration = 1500, className = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const targetNum = typeof end === 'number' ? end : parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0
    if (targetNum <= 0) {
      setCount(targetNum)
      return
    }

    const steps = 30
    const stepValue = targetNum / steps
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setCount(targetNum)
        clearInterval(timer)
      } else {
        const current = stepValue * currentStep
        setCount(Number.isInteger(targetNum) ? Math.floor(current) : Math.round(current * 10) / 10)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [end, duration])

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
