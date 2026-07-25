import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Skip on touch devices entirely
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true)
      return
    }

    setIsTouchDevice(false)

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      const target = e.target
      if (target && target.closest) {
        const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .group')
        setIsHovered(!!isInteractive)
      }
    }

    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  // Smooth Follower Spring Loop
  useEffect(() => {
    if (isTouchDevice) return
    let animationFrameId
    const follow = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }))
      animationFrameId = requestAnimationFrame(follow)
    }
    follow()
    return () => cancelAnimationFrame(animationFrameId)
  }, [pos, isTouchDevice])

  if (isTouchDevice || !isVisible) return null

  const ringSize = isHovered ? 44 : isClicked ? 28 : 36
  const dotSize = 10

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Outer Glowing Spring Ring */}
      <div
        style={{
          position: 'fixed',
          left: followerPos.x - ringSize / 2,
          top: followerPos.y - ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          pointerEvents: 'none',
          transition: 'width 0.15s, height 0.15s, background 0.15s, box-shadow 0.15s, border-color 0.15s, transform 0.1s',
          background: isHovered
            ? 'rgba(168, 85, 247, 0.2)'
            : isClicked
            ? 'rgba(168, 85, 247, 0.3)'
            : 'rgba(124, 58, 237, 0.1)',
          border: isHovered
            ? '1.5px solid rgba(168, 85, 247, 0.8)'
            : '1.5px solid rgba(168, 85, 247, 0.4)',
          boxShadow: isHovered
            ? '0 0 20px rgba(168, 85, 247, 0.5)'
            : '0 0 12px rgba(124, 58, 237, 0.3)',
          transform: isClicked ? 'scale(0.85)' : isHovered ? 'scale(1.15)' : 'scale(1)',
        }}
      />

      {/* Center Precise Dot */}
      <div
        style={{
          position: 'fixed',
          left: pos.x - dotSize / 2,
          top: pos.y - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          pointerEvents: 'none',
          transition: 'background 0.1s, box-shadow 0.1s, transform 0.1s',
          background: isHovered ? '#22d3ee' : '#c4b5fd',
          boxShadow: isHovered
            ? '0 0 12px #22d3ee, 0 0 4px #22d3ee'
            : '0 0 8px #a78bfa',
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
        }}
      />
    </div>
  )
}
