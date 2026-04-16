import { useState, useCallback, useEffect } from 'react'
import type { UserUnit } from '../models/userBox'
import type { ExtendedUnit } from '../models/units'
import { loadBox, saveBox, exportBoxJSON, importBoxJSON } from '../services/storage'
import { getUnitsCache, subscribeUnitsCache } from '../services/unitsCache'

/** Merge fresh detail/stats from live units cache into a stored box entry */
function mergeDetail(entry: UserUnit, liveCache: ExtendedUnit[]): UserUnit {
  const live = liveCache.find(u => u.id === entry.unit.id)
  if (!live) return entry
  return {
    ...entry,
    unit: {
      ...live,
    },
  }
}

export function useUserBox() {
  const [box, setBox] = useState<UserUnit[]>(() => loadBox())

  // Re-hydrate cuando la caché de unidades se publica o ya existía al montar
  useEffect(() => {
    function runHydration() {
      const liveCache = getUnitsCache()
      if (!liveCache) return
      setBox(prev => {
        const hydrated = prev.map(e => mergeDetail(e, liveCache))
        const changed = hydrated.some((h, i) =>
          h.unit.detail !== prev[i]?.unit.detail
        )
        return changed ? hydrated : prev
      })
    }
    runHydration()
    return subscribeUnitsCache(runHydration)
  }, [])

  const persist = useCallback((next: UserUnit[]) => {
    setBox(next)
    saveBox(next)
  }, [])

  const add = useCallback((unit: ExtendedUnit) => {
    setBox(prev => {
      if (prev.some(u => u.unit.id === unit.id)) return prev
      const entry: UserUnit = {
        id: crypto.randomUUID(),
        unit,
        level:     { lvl: unit.maxLevel },
        cc:        { hp: 0, atk: 0, rcv: 0 },
        createdAt: Date.now(),
      }
      const next = [...prev, entry]
      saveBox(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setBox(prev => {
      const next = prev.filter(u => u.id !== id)
      saveBox(next)
      return next
    })
  }, [])

  const update = useCallback((updated: UserUnit) => {
    setBox(prev => {
      const next = prev.map(u => u.id === updated.id ? updated : u)
      saveBox(next)
      return next
    })
  }, [])

  const exportDB = useCallback(() => exportBoxJSON(box), [box])

  const importDB = useCallback((raw: string) => {
    const imported = importBoxJSON(raw)
    const liveCache = getUnitsCache()
    const hydrated = liveCache ? imported.map(e => mergeDetail(e, liveCache)) : imported
    persist(hydrated)
  }, [persist])

  const reset = useCallback(() => persist([]), [persist])

  return { box, add, remove, update, exportDB, importDB, reset }
}
