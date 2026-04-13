import { useState, useCallback } from 'react'
import { loadFavorites, saveFavorites } from '../services/storage'

export function useFavorites() {
  const [ids, setIds] = useState<Set<number>>(() => new Set(loadFavorites()))

  const toggle = useCallback((id: number) => {
    setIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavorites([...next])
      return next
    })
  }, [])

  const isFavorite = useCallback((id: number) => ids.has(id), [ids])

  return { favorites: ids, toggle, isFavorite }
}
