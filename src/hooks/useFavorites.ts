import { useState, useCallback } from 'react'

const FAV_KEY = 'optc-favorites'

function loadFavorites(): Set<number> {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set()
  } catch { return new Set() }
}

function saveFavorites(s: Set<number>) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...s])) } catch { /**/ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites)

  const toggle = useCallback((id: number) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites])

  return { favorites, toggle, isFavorite }
}
