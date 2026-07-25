import { useEffect } from 'react'

export function use3DScroll() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05,
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const targets = document.querySelectorAll('.scroll-3d-card')

    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [])
}
