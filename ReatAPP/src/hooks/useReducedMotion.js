import { useEffect, useState } from 'react'

export function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)

    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  return reducedMotion
}

