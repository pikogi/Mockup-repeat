import { useEffect, useState } from 'react'
import { loadShowcaseState, saveShowcaseState, SHOWCASE_STORAGE_KEY } from '@/constants/moonCafeShowcase'

// Shared state for the Café Moon showcase demo (admin + public pages). Persists to
// localStorage and picks up changes made in other tabs, so a public page opened via
// "Ver vitrina" updates live while the admin edits.
export default function useMoonCafeShowcase() {
  const [state, setState] = useState(loadShowcaseState)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SHOWCASE_STORAGE_KEY) setState(loadShowcaseState())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const update = (updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveShowcaseState(next)
      return next
    })
  }

  const updateShowcase = (id, updater) =>
    update((prev) => ({
      ...prev,
      showcases: prev.showcases.map((s) => (s.id === id ? updater(s) : s)),
    }))

  return { ...state, update, updateShowcase }
}

export const genId = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36)

export const showcasePublicUrl = (id) => `${window.location.origin}/showcase-demo/mooncafe/${id}`
