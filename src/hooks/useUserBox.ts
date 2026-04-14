import { useState, useCallback, useEffect } from 'react'
import type { UserUnit } from '../models/userBox'
import type { ExtendedUnit } from '../models/units'
import { loadBox, saveBox, exportBoxJSON, importBoxJSON } from '../services/storage'

// Units cache reference — set once units finish loading via hydrateBox()
let _unitsCache: ExtendedUnit[] | null = null

/** Call this once units are loaded so the box can re-hydrate stale detail objects */
export function hydrateBox(units: ExtendedUnit[]) {
  _unitsCache = units
}

/** Merge fresh detail/stats from live units cache into a stored box entry */
function mergeDetail(entry: UserUnit): UserUnit {
  if (!_unitsCache) return entry
  const live = _unitsCache.find(u => u.id === entry.unit.id)
  if (!live) return entry
  return {
    ...entry,
    unit: {
      ...live,               // always use latest name/type/class/stats
      // preserve user-specific overrides if any
    },
  }
}

export function useUserBox() {
  const [box, setBox] = useState<UserUnit[]>(() => loadBox())

  // Re-hydrate whenever units cache becomes available
  useEffect(() => {
    if (!_unitsCache) return
    setBox(prev => {
      const hydrated = prev.map(mergeDetail)
      // Only update state if something actually changed
      const changed = hydrated.some((h, i) =>
        h.unit.detail !== prev[i]?.unit.detail
      )
      return changed ? hydrated : prev
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_unitsCache])

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
    // Re-hydrate immediately if units are already loaded
    const hydrated = _unitsCache ? imported.map(mergeDetail) : imported
    persist(hydrated)
  }, [persist])

  const reset = useCallback(() => persist([]), [persist])

  return { box, add, remove, update, exportDB, importDB, reset }
}
